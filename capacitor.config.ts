import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Pair Patrol — iOS (Capacitor) yapılandırması.
 *
 * Uygulama sunucu tarafı render (TanStack Start) kullandığı için native kabuk,
 * yayınlanan web uygulamasını yükler. Böylece iOS paketi her zaman güncel kalır.
 * Tamamen offline bir paket istenirse statik export gerekir.
 */
const config: CapacitorConfig = {
  appId: 'app.lovable.pairpatrol',
  appName: 'Pair Patrol',
  webDir: 'public',
  server: {
    url: 'https://duo-duty-tracker.lovable.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#FDF6EC',
  },
};

export default config;
