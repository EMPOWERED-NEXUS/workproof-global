import { useRouter } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <PlaceholderScreen
      title="Profile"
      description="Your worker profile will be managed here in a later phase."
      onBack={() => router.replace('/')}
      backLabel="Back to welcome"
    />
  );
}
