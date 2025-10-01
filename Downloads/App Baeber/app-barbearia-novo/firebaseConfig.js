import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// Substitua pelos valores do seu projeto Firebase
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Para configurar:
// 1. Vá para https://console.firebase.google.com/
// 2. Crie um novo projeto ou use um existente
// 3. Ative Authentication e adicione Google e Facebook como provedores
// 4. Para Google: Obtenha o Client ID do Google Cloud Console
// 5. Para Facebook: Crie um app no Facebook Developers e obtenha o App ID
// 6. Substitua os valores acima pelos reais
// 7. No app.json, adicione os schemes:
//    "scheme": "com.googleusercontent.apps.YOUR_GOOGLE_CLIENT_ID",
//    "facebookScheme": "fbYOUR_FACEBOOK_APP_ID"

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider, FacebookAuthProvider };
