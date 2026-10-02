import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.noorani.quran',
  appName: 'নূরানী কুরআন',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
