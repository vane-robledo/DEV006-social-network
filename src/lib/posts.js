import { collection, getDocs } from 'firebase/firestore';
// eslint-disable-next-line import/named
import { firestore } from './firebaseConf';

const colRef = collection(firestore, 'posts');
getDocs(colRef)
  .then((snapshot) => {
    console.log(snapshot.docs);
  });
