import { useRouter } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function ReceiptsScreen() {
  const router = useRouter();

  return (
    <PlaceholderScreen
      title="Receipts"
      description="Verified Work Receipts will be listed here in a later phase. Uploads and offline storage are not part of Phase M1."
      onBack={() => router.replace('/')}
      backLabel="Back to welcome"
    />
  );
}
