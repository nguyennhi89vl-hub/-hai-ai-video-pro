import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'vn.haiaivideopro.app',
  appName: 'HAI AI VIDEO PRO',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  android: { allowMixedContent: false }
};

export default config;
