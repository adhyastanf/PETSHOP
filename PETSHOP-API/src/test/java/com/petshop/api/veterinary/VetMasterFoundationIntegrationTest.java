package com.petshop.api.veterinary;

import com.petshop.api.auth.BaseIntegrationTest;
import com.petshop.api.entity.pet.PetType;
import com.petshop.api.entity.veterinary.*;
import com.petshop.api.pet.persistence.PetTypeRepository;
import com.petshop.api.veterinary.persistence.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Integration tests for the Veterinary Medical Master database foundation.
 *
 * <p>Verifies:
 * <ul>
 *   <li>Migration V5 creates all expected tables.</li>
 *   <li>Seed data for vet_source and vet_terminology_version is present.</li>
 *   <li>DOG and CAT species link correctly to vet concepts via existing pet_types.</li>
 *   <li>A concept can have multiple names (EN + ID) and multiple synonyms.</li>
 *   <li>A concept can be linked to multiple species independently.</li>
 *   <li>Procedures remain separate from diagnosis/condition concepts.</li>
 *   <li>External terminology mappings are optional and use concept UUID as PK.</li>
 *   <li>Source/version provenance is recorded per concept and procedure.</li>
 *   <li>Lifecycle: PENDING_REVIEW → ACTIVE → DEPRECATED works; deprecated
 *       concept keeps its record and can point to a replacement.</li>
 *   <li>The partial unique index prevents two primary parents for one child.</li>
 *   <li>Existing vaccine_types and pet_vaccinations tables are unaffected.</li>
 * </ul>
 *
 * <p><strong>Docker note:</strong> These tests require a running PostgreSQL
 * container via Testcontainers. If Docker is unavailable the tests will not
 * execute — see the final report for details.
 */
@Transactional
class VetMasterFoundationIntegrationTest extends BaseIntegrationTest {

    @Autowired private JdbcTemplate jdbc;
    @Autowired private PetTypeRepository petTypeRepository;
    @Autowired private VetTerminologyVersionRepository versionRepository;
    @Autowired private VetSourceRepository sourceRepository;
    @Autowired private VetConceptRepository conceptRepository;
    @Autowired private VetConceptNameRepository conceptNameRepository;
    @Autowired private VetConceptSynonymRepository synonymRepository;
    @Autowired private VetConceptSpeciesRepository speciesRepository;
    @Autowired private VetConceptExternalMappingRepository mappingRepository;
    @Autowired private VetConceptRelationshipRepository relationshipRepository;
    @Autowired private VetProcedureRepository procedureRepository;
    @Autowired private VetProcedureSpeciesRepository procedureSpeciesRepository;

    private VetTerminologyVersion initialVersion;
    private VetSource wsavaSource;

    // ── setup ────────────────────────────────────────────────────────────────

    @BeforeEach
    void loadSeededData() {
        initialVersion = versionRepository.findByVersionCode("OYEN-VET-INITIAL")
                .orElseThrow(() -> new IllegalStateException("OYEN-VET-INITIAL version not found"));
        wsavaSource = sourceRepository.findByCode("WSAVA")
                .orElseThrow(() -> new IllegalStateException("WSAVA source not found"));
    }

    // ── 1. Migration: tables created ──────────────────────────────────────

    @Test
    void migrationCreatesAllVetTables() {
        String[] expectedTables = {
                "vet_source",
                "vet_terminology_version",
                "vet_concept",
                "vet_concept_name",
                "vet_concept_synonym",
                "vet_concept_species",
                "vet_concept_external_mapping",
                "vet_concept_relationship",
                "vet_concept_knowledge",
                "vet_vaccine_concept",
                "vet_procedure",
                "vet_procedure_name",
                "vet_procedure_species"
        };
        for (String table : expectedTables) {
            Integer count = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.tables "
                    + "WHERE table_schema = 'public' AND table_name = ?",
                    Integer.class, table);
            assertThat(count)
                    .as("Expected table '%s' to exist after V5 migration", table)
                    .isEqualTo(1);
        }
    }

    // ── 2. Seed data ──────────────────────────────────────────────────────

    @Test
    void seedCreatesInitialTerminologyVersion() {
        assertThat(initialVersion.getVersionCode()).isEqualTo("OYEN-VET-INITIAL");
        assertThat(initialVersion.getIsCurrent()).isTrue();
    }

    @Test
    void seedCreatesAllFourSources() {
        String[] expectedCodes = {"SNOMEDCT_VET", "WSAVA", "AAHA", "MERCK_VET"};
        for (String code : expectedCodes) {
            Optional<VetSource> source = sourceRepository.findByCode(code);
            assertThat(source)
                    .as("Expected source '%s' to be seeded", code)
                    .isPresent();
            assertThat(source.get().getIsActive()).isTrue();
        }
    }

    @Test
    void onlyOneTerminologyVersionIsCurrentAtSeedTime() {
        long currentCount = versionRepository.findAll().stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsCurrent()))
                .count();
        assertThat(currentCount).isEqualTo(1);
    }

    // ── 3. DOG and CAT species via existing pet_types ─────────────────────

    @Test
    void dogAndCatExistInPetTypes() {
        assertThat(petTypeRepository.findAll())
                .extracting(PetType::getCode)
                .contains("DOG", "CAT");
    }

    @Test
    void conceptCanBeLinkedToDogsAndCatsSeparately() {
        VetConcept concept = savedConcept("DIAG-INF-T01", "DISEASE");

        PetType dog = petTypeRepository.findAll().stream()
                .filter(p -> "DOG".equals(p.getCode())).findFirst().orElseThrow();
        PetType cat = petTypeRepository.findAll().stream()
                .filter(p -> "CAT".equals(p.getCode())).findFirst().orElseThrow();

        speciesRepository.save(VetConceptSpecies.builder()
                .id(new VetConceptSpeciesId(concept.getId(), dog.getId()))
                .concept(concept).petType(dog).build());
        speciesRepository.save(VetConceptSpecies.builder()
                .id(new VetConceptSpeciesId(concept.getId(), cat.getId()))
                .concept(concept).petType(cat).build());
        speciesRepository.flush();

        assertThat(speciesRepository.findByIdConceptId(concept.getId())).hasSize(2);
        assertThat(speciesRepository.findByIdPetTypeId(dog.getId())).isNotEmpty();
        assertThat(speciesRepository.findByIdPetTypeId(cat.getId())).isNotEmpty();
    }

    // ── 4. Concepts: names and synonyms ──────────────────────────────────

    @Test
    void conceptCanHaveEnglishAndIndonesianCanonicalNames() {
        VetConcept concept = savedConcept("DIAG-ENDO-T01", "METABOLIC_ENDOCRINE");

        conceptNameRepository.save(VetConceptName.builder()
                .id(new VetConceptNameId(concept.getId(), "en"))
                .concept(concept).name("Diabetes mellitus").build());
        conceptNameRepository.save(VetConceptName.builder()
                .id(new VetConceptNameId(concept.getId(), "id"))
                .concept(concept).name("Diabetes melitus").build());
        conceptNameRepository.flush();

        assertThat(conceptNameRepository.findByIdConceptId(concept.getId())).hasSize(2);
        assertThat(conceptNameRepository.existsByIdConceptIdAndIdLanguageCode(concept.getId(), "en")).isTrue();
        assertThat(conceptNameRepository.existsByIdConceptIdAndIdLanguageCode(concept.getId(), "id")).isTrue();
    }

    @Test
    void conceptCanHaveMultipleSynonymsOfDifferentTypes() {
        VetConcept concept = savedConcept("DIAG-ENDO-T02", "METABOLIC_ENDOCRINE");

        synonymRepository.save(VetConceptSynonym.builder()
                .concept(concept).languageCode("en")
                .synonymText("DM").synonymType("ABBREVIATION").build());
        synonymRepository.save(VetConceptSynonym.builder()
                .concept(concept).languageCode("en")
                .synonymText("Sugar disease").synonymType("COMMON_OWNER").build());
        synonymRepository.save(VetConceptSynonym.builder()
                .concept(concept).languageCode("id")
                .synonymText("Kencing manis").synonymType("COMMON_OWNER").build());
        synonymRepository.flush();

        assertThat(synonymRepository.findByConcept_IdOrderByLanguageCodeAsc(concept.getId())).hasSize(3);
        assertThat(synonymRepository.findByConcept_IdAndLanguageCode(concept.getId(), "id")).hasSize(1);
    }

    // ── 5. Procedures are separate from diagnosis concepts ────────────────

    @Test
    void procedureAndConceptAreStoredInSeparateTables() {
        VetConcept diagnosis = savedConcept("DIAG-GI-T01", "DISEASE");
        VetProcedure procedure = savedProcedure("PROC-DIA-T01", "DIAGNOSTIC_TEST");

        // Confirm they are in distinct tables and neither pollutes the other
        assertThat(conceptRepository.findByCanonicalCode("DIAG-GI-T01")).isPresent();
        assertThat(procedureRepository.findByCanonicalCode("PROC-DIA-T01")).isPresent();

        // The diagnosis concept must NOT appear in vet_procedure
        assertThat(procedureRepository.findByCanonicalCode("DIAG-GI-T01")).isEmpty();
        // The procedure must NOT appear in vet_concept
        assertThat(conceptRepository.findByCanonicalCode("PROC-DIA-T01")).isEmpty();
    }

    @Test
    void procedureCanBeLinkedToSpecies() {
        VetProcedure proc = savedProcedure("PROC-EXM-T01", "EXAMINATION");
        PetType dog = petTypeRepository.findAll().stream()
                .filter(p -> "DOG".equals(p.getCode())).findFirst().orElseThrow();

        procedureSpeciesRepository.save(VetProcedureSpecies.builder()
                .id(new VetProcedureSpeciesId(proc.getId(), dog.getId()))
                .procedure(proc).petType(dog).build());
        procedureSpeciesRepository.flush();

        assertThat(procedureSpeciesRepository.findByIdProcedureId(proc.getId())).hasSize(1);
    }

    // ── 6. External terminology mappings are optional ─────────────────────

    @Test
    void conceptCanExistWithoutExternalMapping() {
        VetConcept concept = savedConcept("DIAG-DER-T01", "DISEASE");
        conceptRepository.flush();
        assertThat(mappingRepository.findByConcept_Id(concept.getId())).isEmpty();
    }

    @Test
    void externalMappingUsesConceptUuidAsPrimaryRelationship() {
        VetConcept concept = savedConcept("DIAG-INF-T02", "DISEASE");

        VetConceptExternalMapping mapping = VetConceptExternalMapping.builder()
                .concept(concept)
                .systemCode("ICD10_VET")
                .systemVersion("2026")
                .externalCode("B82")
                .matchType("EXACT")
                .isCurrent(true)
                .build();
        mappingRepository.save(mapping);
        mappingRepository.flush();

        assertThat(mappingRepository.findByConcept_Id(concept.getId())).hasSize(1);
        // External code is NOT the PK — internal UUID is
        assertThat(mapping.getId()).isNotNull();
    }

    // ── 7. Source / version provenance ────────────────────────────────────

    @Test
    void conceptRecordsSourceAndVersion() {
        VetConcept concept = VetConcept.builder()
                .canonicalCode("VAX-INF-T01")
                .conceptType("VACCINE")
                .status("PENDING_REVIEW")
                .version(initialVersion)
                .source(wsavaSource)
                .sourceReference("WSAVA VGG 2024 core vaccine list")
                .build();
        conceptRepository.save(concept);
        conceptRepository.flush();

        VetConcept loaded = conceptRepository.findByCanonicalCode("VAX-INF-T01").orElseThrow();
        assertThat(loaded.getSource().getCode()).isEqualTo("WSAVA");
        assertThat(loaded.getVersion().getVersionCode()).isEqualTo("OYEN-VET-INITIAL");
        assertThat(loaded.getSourceReference()).contains("WSAVA");
    }

    // ── 8. Lifecycle: PENDING_REVIEW → ACTIVE → DEPRECATED ───────────────

    @Test
    void conceptFollowsStatusLifecycle() {
        VetConcept concept = savedConcept("DIAG-RES-T01", "DISEASE");
        assertThat(concept.getStatus()).isEqualTo("PENDING_REVIEW");

        concept.setStatus("ACTIVE");
        conceptRepository.save(concept);

        VetConcept active = conceptRepository.findById(concept.getId()).orElseThrow();
        assertThat(active.getStatus()).isEqualTo("ACTIVE");

        // Deprecate with a replacement
        VetConcept replacement = savedConcept("DIAG-RES-T01B", "DISEASE");
        active.setStatus("DEPRECATED");
        active.setDeprecatedAt(Instant.now());
        active.setDeprecatedReason("Replaced by more specific concept");
        active.setReplacedBy(replacement);
        conceptRepository.save(active);
        conceptRepository.flush();

        VetConcept deprecated = conceptRepository.findById(concept.getId()).orElseThrow();
        assertThat(deprecated.getStatus()).isEqualTo("DEPRECATED");
        assertThat(deprecated.getReplacedBy().getCanonicalCode()).isEqualTo("DIAG-RES-T01B");
        assertThat(deprecated.getDeprecatedAt()).isNotNull();

        // The deprecated concept must still be retrievable — never hard-deleted
        assertThat(conceptRepository.existsById(concept.getId())).isTrue();
    }

    // ── 9. Concept hierarchy: primary-parent partial unique index ─────────

    @Test
    void childConceptCanHaveOnlyOnePrimaryParent() {
        VetConcept parent1 = savedConcept("DIAG-INF-T03", "DISEASE");
        VetConcept parent2 = savedConcept("DIAG-INF-T04", "DISEASE");
        VetConcept child   = savedConcept("DIAG-INF-T05", "DISEASE");

        relationshipRepository.save(VetConceptRelationship.builder()
                .childConcept(child).parentConcept(parent1)
                .relationshipType("IS_A").isPrimaryParent(true).build());
        relationshipRepository.flush();

        // A non-primary parent is allowed in addition
        relationshipRepository.save(VetConceptRelationship.builder()
                .childConcept(child).parentConcept(parent2)
                .relationshipType("IS_A").isPrimaryParent(false).build());
        relationshipRepository.flush();

        assertThat(relationshipRepository.findByChildConcept_Id(child.getId())).hasSize(2);
        assertThat(relationshipRepository.findByChildConcept_IdAndIsPrimaryParentTrue(child.getId()))
                .isPresent();
    }

    @Test
    void childConceptCannotHaveTwoPrimaryParents() {
        VetConcept parent1 = savedConcept("DIAG-INF-T06", "DISEASE");
        VetConcept parent2 = savedConcept("DIAG-INF-T07", "DISEASE");
        VetConcept child   = savedConcept("DIAG-INF-T08", "DISEASE");

        relationshipRepository.save(VetConceptRelationship.builder()
                .childConcept(child).parentConcept(parent1)
                .relationshipType("IS_A").isPrimaryParent(true).build());
        relationshipRepository.flush();

        // Attempting a second primary parent must violate the partial unique index
        relationshipRepository.save(VetConceptRelationship.builder()
                .childConcept(child).parentConcept(parent2)
                .relationshipType("IS_A").isPrimaryParent(true).build());

        assertThatThrownBy(() -> relationshipRepository.flush())
                .isInstanceOf(Exception.class); // DB constraint violation
    }

    // ── 10. Existing vaccine_types table is unaffected ────────────────────

    @Test
    void existingVaccineTypesTableRemainsIntact() {
        // V5 must not have dropped or altered vaccine_types
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables "
                + "WHERE table_schema = 'public' AND table_name = 'vaccine_types'",
                Integer.class);
        assertThat(count).isEqualTo(1);

        // Seeded vaccines must still be present
        Integer vaccineCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM vaccine_types", Integer.class);
        assertThat(vaccineCount).isGreaterThan(0);
    }

    // ── 11. pet_vaccinations table is unaffected ──────────────────────────

    @Test
    void existingPetVaccinationsTableRemainsIntact() {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables "
                + "WHERE table_schema = 'public' AND table_name = 'pet_vaccinations'",
                Integer.class);
        assertThat(count).isEqualTo(1);
    }

    // ── helpers ──────────────────────────────────────────────────────────

    private VetConcept savedConcept(String code, String type) {
        VetConcept c = VetConcept.builder()
                .canonicalCode(code)
                .conceptType(type)
                .status("PENDING_REVIEW")
                .version(initialVersion)
                .build();
        return conceptRepository.save(c);
    }

    private VetProcedure savedProcedure(String code, String category) {
        VetProcedure p = VetProcedure.builder()
                .canonicalCode(code)
                .procedureCategory(category)
                .status("PENDING_REVIEW")
                .requiresAnaesthesia(false)
                .requiresVeterinarian(false)
                .version(initialVersion)
                .build();
        return procedureRepository.save(p);
    }
}
