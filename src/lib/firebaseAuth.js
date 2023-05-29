import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebaseConf.js';

function displaySuccessMessage() {
  // Crea un elemento HTML para mostrar el mensaje de éxito
  const successMessage = document.createElement('p');
  successMessage.textContent = '¡Registro exitoso!';

  // Agrega el elemento al DOM para que se muestre en la página
  const signUpSection = document.getElementsByClassName('signUpSection')[0];
  signUpSection.appendChild(successMessage);

  // Elimina el mensaje de éxito después de unos segundos
  setTimeout(() => {
    signUpSection.removeChild(successMessage);
  }, 3000);
}

export async function registerUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Agregar el nombre del usuario al perfil
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    console.log('registrado', userCredential);
    displaySuccessMessage();
  } catch (error) {
    console.error(error);
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('loggeado', userCredential);
  } catch (error) {
    console.log(error);
  }
}

export const googleLogin = (navigateTo) => {
  const provider = new GoogleAuthProvider(); // Mueve la declaración de la variable provider aquí

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      navigateTo('/feed');
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

export const colRef = collection(db, 'posts');

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

export function getPosts() {
  return getDocs(colRef)
    .then((snapshot) => {
      const posts = [];
      snapshot.docs.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      return posts;
    })
    .catch((err) => {
      console.log(err.message);
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
