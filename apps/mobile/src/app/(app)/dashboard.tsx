import { useRouter } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <PlaceholderScreen
      title="Dashboard"
      description="Your worker dashboard will appear here in a later phase."
      onBack={() => router.replace('/')}
      backLabel="Back to welcome"
    />
  );
}
