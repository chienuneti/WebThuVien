/**
 * Environment configuration for development
 * Switch between mock backend and real API
 */

export const environment = {
  production: false,
  useMockBackend: true, // Set to false to use real API
  apiUrl: 'http://localhost:3000/api/auth',
};
