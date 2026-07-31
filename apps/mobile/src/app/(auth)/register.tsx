import { useRouter } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <PlaceholderScreen
      title="Create profile"
      description="Profile registration will be added in a later phase. This screen is a navigation placeholder for WorkProof Global."
      onBack={() => router.replace('/')}
      backLabel="Back to welcome"
    />
  );
}
