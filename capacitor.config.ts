import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.cybershield.app',
  appName: 'КиберЩит',
  webDir: 'dist',
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
