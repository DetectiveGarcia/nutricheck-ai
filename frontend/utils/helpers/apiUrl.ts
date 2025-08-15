import { Platform } from 'react-native';

let API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// If we're running on a physical phone in Expo Go, override host.docker.internal
if (Platform.OS !== 'web' && API_BASE_URL?.includes('host.docker.internal')) {
  // Hardcode or detect your dev machine IP
  API_BASE_URL = API_BASE_URL.replace('host.docker.internal', '192.168.1.42');
}

export default API_BASE_URL;
