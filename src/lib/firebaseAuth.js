import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from './firebaseConf.js';

export async function registerUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Agregar el nombre del usuario al perfil
    await updateProfile(userCredential.user, {
      displayName: name,
    });
    // Enviar correo electrónico de verificación
    await sendEmailVerification(userCredential.user);
    // return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('loggeado', userCredential);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const googleLogin = (navigateTo) => {
  const provider = new GoogleAuthProvider();
  const loginData = {
    token: null,
    user: null,
  };
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      loginData.token = credential.accessToken;
      loginData.user = result.user;
      navigateTo('/feed');
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      console.log(error);
      // ...
    });
};

// export const colRef = collection(db, 'posts');
export function listenToAuthChanges(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario autenticado
      callback(true);
    } else {
      // Usuario no autenticado
      callback(false);
    }
  });
}

export function signOutUser() {
  signOut(auth)
    .then(() => {
      // Cierre de sesión exitoso
      console.log('¡Hasta pronto!');
    })
    .catch((error) => {
      // Ocurrió un error durante el cierre de sesión
      console.error('Error al cerrar sesión:', error);
    });
}

export function getUserProfilePhotoUrl() {
  const user = auth.currentUser;
  if (user) {
    if (user.providerData.some((provider) => provider.providerId === 'google.com')) {
      // Si el usuario tiene un proveedor de identidad de Google, devuelve la imagen de Google
      return user.photoURL;
    }
    // Si el usuario no tiene un proveedor de identidad de Google, devuelve la imagen predeterminada
    return './pages/images/profile.jpg'; // Reemplaza la ruta con la ubicación de tu foto de perfil predeterminada
  }
  return null;
}
