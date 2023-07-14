require('dotenv').config()

module.exports = {
  expo: {
    name: 'Kasir Portabel',
    slug: 'Kasir-Portabel',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.falbas.kasirportabel',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-barcode-scanner',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access camera.',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '921dca93-862e-4e3e-b3c7-5ecc37fed7e0',
      },
      apiUrl: process.env.BACKEND_URL,
    },
  },
}
