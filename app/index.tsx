import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/userStore';

export default function Index() {
  const { isAuthenticated } = useUserStore();
  
  // Redirect authenticated users to tabs, otherwise to login
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}
