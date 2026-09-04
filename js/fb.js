window.FB_CFG = {
  apiKey: "AIzaSyB5iskgdR1Po0zSI-yz4BaJHc9iwBq4ShA",
  authDomain: "almoustakbal-3aa2e.firebaseapp.com",
  projectId: "almoustakbal-3aa2e",
  storageBucket: "almoustakbal-3aa2e.firebasestorage.app",
  messagingSenderId: "351375888317",
  appId: "1:351375888317:web:b24370f523b29105f8ccd4"
};
window.FB = null;
try {
  if (window.firebase) {
    firebase.initializeApp(window.FB_CFG);
    window.FB = { db: firebase.firestore(), auth: firebase.auth() };
  }
} catch (e) { console.warn('Firebase off:', e.message); }
