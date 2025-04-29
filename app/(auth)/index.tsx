import { Redirect } from 'expo-router';

export default function AuthIndex() {
  // Redirect to login screen when accessing the auth route directly
  return <Redirect href="/login" />;
}
