import { onAuthStateChanged } from 'firebase/auth';
import error from './pages/error.js';
import welcomePage from './pages/home.js';
import signIn from './pages/signIn.js';
import signUp from './pages/signUp.js';
import feed from './pages/feed.js';
import { auth } from './lib/firebaseConf.js';

const routes = [
  { path: '/', component: welcomePage },
  { path: '/signin', component: signIn },
  { path: '/signup', component: signUp },
  { path: '/error', component: error },
  { path: '/feed', component: feed },
];

const defaultRoute = '/';
const root = document.getElementById('root');

function navigateTo(hash) {
  const route = routes.find((routeFound) => routeFound.path === hash);
  if (route) {
    window.history.pushState({}, route.path, window.location.origin + route.path);
    if (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    root.appendChild(route.component(navigateTo));
  } else {
    navigateTo('/error');
  }
}

window.onpopstate = () => {
  navigateTo(window.location.pathname);
};

// Verificar el estado de autenticación del usuario antes de cargar la página
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario autenticado, permitir acceso a las rutas protegidas
    navigateTo(window.location.pathname || defaultRoute);
  } else {
    // Usuario no autenticado, redirigir a la página de inicio de sesión
    navigateTo('/');
  }
});
