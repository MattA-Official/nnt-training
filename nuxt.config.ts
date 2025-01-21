// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['nuxt-vuefire'],

  vuefire: {
    config: { // This will need replacing with the Firebase config for your project
      apiKey: "AIzaSyDtXd4n9crDStw6KbXmvQ7wSQBJpcR-8vk",
      authDomain: "nnt-training-test.firebaseapp.com",
      projectId: "nnt-training-test",
      storageBucket: "nnt-training-test.firebasestorage.app",
      messagingSenderId: "560599823624",
      appId: "1:560599823624:web:0a61c02269e3e39f65e8bd"
    },
    auth: {
      enabled: true,
      sessionCookie: true,
    }
  },

  nitro: {
    firebase: {
      gen: 2
    }
  }
})