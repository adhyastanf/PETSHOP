import AddressContainers from '@/containers/Address/AddressContainers';
import PetsContainers from '@/containers/Pets/PetsContainers';
import ProfileContainers from '@/containers/Profile/ProfileContainers';
import { notFound } from 'next/navigation';

const tabs = {
  profile: <ProfileContainers />,
  address: <AddressContainers />,
  pets: <PetsContainers />,
};

export default async function SettingsPage({
  params,
}: {
  params: Promise<{
    tab: string;
  }>;
}) {
  const { tab } = await params;
  const content = tabs[tab as keyof typeof tabs];

  if (!content) {
    notFound();
  }

  return content;
}
