require('dotenv').config()

module.exports = {
  expo: {
    name: 'Wakalk',
    slug: 'Wakalk',
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
      apiUrl: process.env.BACKEND_URL,
    },
  },
}
