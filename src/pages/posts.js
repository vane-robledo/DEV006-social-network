import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebaseConf.js';

const colRef = collection(db, 'posts');

getDocs(colRef).then((snapshot) => {
  console.log(snapshot.docs);
});

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

// export const colRef = collection(db, "posts");

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
