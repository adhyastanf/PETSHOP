-- ============================================================
-- Run this script ONCE as the postgres superuser to create
-- the petshop database and user.
--
-- How to run:
--   Option 1: Open DBeaver, connect as postgres, open SQL editor, paste & execute.
--   Option 2: psql -U postgres -f scripts/create-database.sql
-- ============================================================

-- Create user (role) for the application
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'petshop') THEN
        CREATE ROLE petshop WITH LOGIN PASSWORD 'petshop';
    END IF;
END
$$;

-- Create database
SELECT 'CREATE DATABASE petshop OWNER petshop'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'petshop')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE petshop TO petshop;

-- Connect to petshop database and grant schema permissions
\connect petshop
GRANT ALL ON SCHEMA public TO petshop;
