import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebaseConf.js';
import { getUserProfilePhotoUrl } from '../lib/firebaseAuth.js';

const colRef = collection(db, 'posts');

const feed = () => {
  const feedSection = document.createElement('section');
  feedSection.classList.add('feedSection');

  const profileNav = document.createElement('nav');
  profileNav.classList.add('profileNav');

  const logOutButton = document.createElement('button');
  logOutButton.classList.add('logoutButton');
  logOutButton.textContent = 'Cerrar sesión';

  const signOutUser = () => {
    // Mostrar mensaje de despedida utilizando alert()
    alert('¡Hasta pronto!');

    // Redirigir al usuario a la página de inicio de sesión después de unos segundos
    setTimeout(() => {
      window.location.href = '/signin';
    }, 2000); // Cambia el valor según la duración deseada del mensaje de despedida

    signOut(auth)
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  logOutButton.addEventListener('click', signOutUser);

  const logoArticle = document.createElement('article');
  logoArticle.classList.add('articleLogoSignUp');

  const logoImg = document.createElement('img');
  logoImg.setAttribute('src', './pages/images/LOGO.png');
  logoImg.setAttribute(
    'alt',
    'Logo: dos boletos para el cine. Uno morado y uno amarillo. Ambos dicen "Cinergia"',
  );
  logoImg.classList.add('logoSignUp');

  const userContainer = document.createElement('div');
  userContainer.classList.add('userContainer');

  const username = document.createElement('p');
  username.classList.add('userSpan');

  const userPhoto = document.createElement('img');
  userPhoto.classList.add('userPhotoNav');

  const postForm = document.createElement('div');
  postForm.classList.add('postForm');

  const postInput = document.createElement('input');
  postInput.classList.add('postInput');
  postInput.setAttribute('type', 'text');
  postInput.setAttribute('placeholder', '¿De cuál peli hablarás hoy?');

  const postBtn = document.createElement('button');
  postBtn.classList.add('postBtn');
  postBtn.setAttribute('type', 'button');
  postBtn.textContent = '¡Publicar!';

  const postsContainer = document.createElement('div');
  postsContainer.classList.add('postsContainer');

  const likePost = async (postId, userId) => {
    const postRef = doc(colRef, postId);
    const postDoc = await getDoc(postRef);
    const postData = postDoc.data();

    const updatedLikes = { ...postData.likes };
    const updatedDislikes = { ...postData.dislikes };

    // Si el usuario ya ha dado me gusta, quitar su voto
    if (updatedLikes[userId]) {
      delete updatedLikes[userId];
    } else {
      // Si el usuario había dado no me gusta previamente, quitar su voto
      if (updatedDislikes[userId]) {
        delete updatedDislikes[userId];
      }
      // Dar me gusta al post
      updatedLikes[userId] = true;
    }

    await updateDoc(postRef, { likes: updatedLikes, dislikes: updatedDislikes });
  };

  const dislikePost = async (postId, userId) => {
    const postRef = doc(colRef, postId);
    const postDoc = await getDoc(postRef);
    const postData = postDoc.data();

    const updatedLikes = { ...postData.likes };
    const updatedDislikes = { ...postData.dislikes };

    // Si el usuario ya ha dado no me gusta, quitar su voto
    if (updatedDislikes[userId]) {
      delete updatedDislikes[userId];
    } else {
      // Si el usuario había dado me gusta previamente, quitar su voto
      if (updatedLikes[userId]) {
        delete updatedLikes[userId];
      }
      // Dar no me gusta al post
      updatedDislikes[userId] = true;
    }

    await updateDoc(postRef, { likes: updatedLikes, dislikes: updatedDislikes });
  };

  postBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addDoc(colRef, {
      post: postInput.value,
      createdAt: new Date(),
      userId: auth.currentUser.uid,
      username: auth.currentUser.displayName,
      likes: {},
      dislikes: {},
    }).then(() => {
      postInput.value = ''; // Limpiar el campo de entrada después de agregar el post
    });
  });

  // Obtener y mostrar los posts existentes en orden descendente por fecha de creación
  const q = query(colRef, orderBy('createdAt', 'desc'));
  onSnapshot(q, (snapshot) => {
    // Limpiar el contenido anterior
    postsContainer.innerHTML = '';
    snapshot.forEach(async (postDoc) => {
      const postData = postDoc.data();
      const postId = postDoc.id;
      const post = postData.post;
      const userId = postData.userId;
      const postUsername = postData.username;
      const likesCount = postData.likes ? Object.keys(postData.likes).length : 0;
      const dislikesCount = postData.dislikes ? Object.keys(postData.dislikes).length : 0;

      // Verificar si el post pertenece al usuario actual
      const isCurrentUserPost = userId === auth.currentUser.uid;

      // Crear un contenedor para el post
      const postContainer = document.createElement('div');
      postContainer.classList.add('postContainer');

      // Crear un elemento para mostrar la foto de perfil del usuario
      const userPhotoElement = document.createElement('img');
      userPhotoElement.classList.add('userPhoto');
      userPhotoElement.setAttribute('src', await getUserProfilePhotoUrl(userId));
      userPhotoElement.setAttribute('alt', 'Foto de perfil del usuario');

      // Crear un elemento para mostrar el post
      const postDiv = document.createElement('div');
      postDiv.classList.add('postDiv');
      postDiv.textContent = post;

      // Crear un elemento para mostrar el nombre de usuario
      const usernameDiv = document.createElement('div');
      usernameDiv.classList.add('usernameDiv');
      usernameDiv.textContent = `Por: ${postUsername}`;

      // Crear un contenedor para los botones de "Me gusta" y "No me gusta"
      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('buttonsContainer');

      // Crear botones de "Me gusta" y "No me gusta"
      const likeBtn = document.createElement('img');
      likeBtn.src = './pages/images/star.png';
      likeBtn.alt = 'me gusta';
      likeBtn.classList.add('likeBtn');

      const dislikeBtn = document.createElement('img');
      dislikeBtn.src = './pages/images/tomate.png';
      dislikeBtn.alt = 'no me gusta';
      dislikeBtn.classList.add('dislikeBtn');

      // Crear un elemento para mostrar el contador de "Me gusta"
      const likesCountDiv = document.createElement('div');
      likesCountDiv.classList.add('likesCountDiv');
      likesCountDiv.textContent = `${likesCount}`;

      // Crear un elemento para mostrar el contador de "No me gusta"
      const dislikesCountDiv = document.createElement('div');
      dislikesCountDiv.classList.add('dislikesCountDiv');
      dislikesCountDiv.textContent = `${dislikesCount}`;

      // Agregar eventos de clic a los botones de "Me gusta" y "No me gusta"
      likeBtn.addEventListener('click', () => {
        likePost(postId, auth.currentUser.uid);
      });

      dislikeBtn.addEventListener('click', () => {
        dislikePost(postId, auth.currentUser.uid);
      });

      // Agregar los botones y los contadores al contenedor de los botones
      buttonsContainer.appendChild(likeBtn);
      buttonsContainer.appendChild(likesCountDiv);
      buttonsContainer.appendChild(dislikeBtn);
      buttonsContainer.appendChild(dislikesCountDiv);

      // Agregar los elementos al contenedor del post
      postContainer.appendChild(userPhotoElement);
      postContainer.appendChild(postDiv);
      postContainer.appendChild(usernameDiv);
      postContainer.appendChild(buttonsContainer);

      // Agregar botones de "Editar" y "Eliminar" si el post pertenece al usuario actual
      if (isCurrentUserPost) {
        const editBtn = document.createElement('button');
        editBtn.classList.add('editBtn');
        editBtn.textContent = 'Editar';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.textContent = 'Eliminar';

        editBtn.addEventListener('click', () => {
          const newPost = prompt('Edita tu post:', post);

          if (newPost && newPost.trim() !== '') {
            updateDoc(postDoc.ref, { post: newPost });
          }
        });

        deleteBtn.addEventListener('click', () => {
          if (confirm('¿Estás seguro/a de que quieres eliminar este post?')) {
            deleteDoc(postDoc.ref);
          }
        });

        postContainer.appendChild(editBtn);
        postContainer.appendChild(deleteBtn);
      }

      // Agregar el contenedor del post al contenedor principal de posts
      postsContainer.appendChild(postContainer);
    });
  });

  // Mostrar el nombre de usuario y la foto de perfil del usuario actual
  onAuthStateChanged(auth, (user) => {
    if (user) {
      username.textContent = user.displayName;
      userPhoto.setAttribute('src', getUserProfilePhotoUrl(user.uid));
    }
  });

  // Agregar elementos al DOM
  logoArticle.appendChild(logoImg);
  userContainer.appendChild(username);
  userContainer.appendChild(userPhoto);
  userContainer.appendChild(logOutButton);
  profileNav.appendChild(logoArticle);
  profileNav.appendChild(userContainer);
  postForm.appendChild(postInput);
  postForm.appendChild(postBtn);
  feedSection.appendChild(profileNav);
  feedSection.appendChild(postForm);
  feedSection.appendChild(postsContainer);

  // Verificar el estado de autenticación del usuario antes de mostrar el feed
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario autenticado, mostrar el feed
      username.textContent = user.displayName;
      feedSection.style.visibility = 'visible';
    } else {
      // Redirigir al usuario a la página de inicio de sesión después de cerrar el mensaje de alerta
      window.location.href = '/';

      // Ocultar el contenido del feed mientras se redirige
      feedSection.style.visibility = 'hidden';
    }
  });

  return feedSection;
};

export default feed;
