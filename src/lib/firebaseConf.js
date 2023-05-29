import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, collection, doc, updateDoc, increment,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyDoRs5TiCvg-5ih7HQqAYZOdrLEUQEKj40',
  authDomain: 'cinergia-vja.firebaseapp.com',
  projectId: 'cinergia-vja',
  storageBucket: 'cinergia-vja.appspot.com',
  messagingSenderId: '797919775414',
  appId: '1:797919775414:web:7759904b12c0d7ca99b417',
  measurementId: 'G-8SL0NK4KPP',
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const colRef = collection(db, 'posts');

// Función para incrementar los likes de un post
export const incrementLikes = async (postId) => {
  const postDoc = doc(db, 'posts', postId);
  try {
    await updateDoc(postDoc, {
      likes: increment(1),
    });
    console.log('Likes incrementados para el post:', postId);
  } catch (error) {
    console.error('Error al incrementar los likes:', error);
  }
};

// Función para incrementar los dislikes de un post
export const incrementDislikes = async (postId) => {
  const postDoc = doc(db, 'posts', postId);
  try {
    await updateDoc(postDoc, {
      dislikes: increment(1),
    });
    console.log('Dislikes incrementados para el post:', postId);
  } catch (error) {
    console.error('Error al incrementar los dislikes:', error);
  }
};
