// import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// import { auth } from '../lib/firebaseConf.js';
import { registerUser, googleLogin } from '../lib/firebaseAuth.js';

const signup = (navigateTo) => {
  const signUpSection = document.createElement('section');
  signUpSection.classList.add('signUpSection');
  const logoArticle = document.createElement('article');
  logoArticle.classList.add('articleLogoSignUp');
  const logoImg = document.createElement('img');
  logoImg.setAttribute('src', './pages/images/LOGO.png');
  logoImg.setAttribute('alt', 'Logo: dos boletos para el cine. Uno morado y uno amarillo. Ambos dicen "Cinergia"');
  logoImg.classList.add('logoSignUp');
  const signUpTxtSpan = document.createElement('span');
  signUpTxtSpan.classList.add('signUpTxtSpan');
  const signUpTxt = document.createElement('h1');
  const communityTxtSpan = document.createElement('span');
  communityTxtSpan.classList.add('spanCommunityTxt');
  const communityTxt = document.createElement('h2');
  const divForm = document.createElement('div');
  divForm.classList.add('registerBox');
  const signUpForm = document.createElement('form');
  signUpForm.classList.add('signUpForm');
  const userLabel = document.createElement('label');
  userLabel.classList.add('signUp');
  const userInput = document.createElement('input');
  userInput.classList.add('userInput');
  userInput.setAttribute('type', 'text');
  userInput.setAttribute('required', 'required');
  userInput.placeholder = 'Crea un nombre de usuario';
  const emailLabel = document.createElement('label');
  emailLabel.classList.add('signUp');
  const emailInput = document.createElement('input');
  emailInput.classList.add('emailInput');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('id', 'userEmail');
  emailInput.setAttribute('required', 'required');
  emailInput.placeholder = 'Introduce tu correo electrónico';
  const passwordLabel = document.createElement('label');
  passwordLabel.classList.add('signUp');
  const passwordInput = document.createElement('input');
  passwordInput.classList.add('passwordInput');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('id', 'userPassword');
  passwordInput.setAttribute('required', 'required');
  passwordInput.placeholder = 'Crea una contraseña';
  const readyBtn = document.createElement('button');
  readyBtn.classList.add('readyBtn');
  readyBtn.setAttribute('id', 'readyBtn');
  readyBtn.setAttribute('type', 'button');
  const foundAccountDiv = document.createElement('div');
  foundAccountDiv.classList.add('foundAccountDiv');
  const foundAccount = document.createElement('p');
  foundAccount.classList.add('foundAccount');
  const foundAccountA = document.createElement('a');
  foundAccountA.setAttribute('id', 'goToSignIn');
  const googleArticle = document.createElement('article');
  googleArticle.setAttribute('class', 'googleArticle');
  const googleTxt = document.createElement('p');
  googleTxt.classList.add('googleTxt');
  const googleBtn = document.createElement('button');
  googleBtn.classList.add('googleBtn');
  googleBtn.setAttribute('type', 'button');
  const googleLogo = document.createElement('Img');
  googleLogo.classList.add('googleLogo');
  googleLogo.setAttribute('src', './pages/images/googleLogo.png');
  googleLogo.setAttribute('alt', 'Logo de Google');
  const errorName = document.createElement('p');
  errorName.classList.add('error');
  errorName.setAttribute('id', 'errorName');
  const errorEmail = document.createElement('p');
  errorEmail.classList.add('error');
  errorEmail.setAttribute('id', 'errorEmail');
  const errorPassword = document.createElement('p');
  errorPassword.classList.add('error');
  errorPassword.setAttribute('id', 'errorPassword');
  readyBtn.addEventListener('click', async (event) => {
    console.log('click');
    event.preventDefault();
    errorName.textContent = '';
    errorEmail.textContent = '';
    errorPassword.textContent = '';
    const name = userInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;
    // Validar campos obligatorios
    if (name === '') {
      errorName.textContent = 'Por favor, ingresa un nombre de usuario.';
      isValid = false;
    }
    if (email === '') {
      errorEmail.textContent = 'Por favor, ingresa un correo electrónico.';
      isValid = false;
    }
    if (password === '') {
      errorPassword.textContent = 'Por favor, ingresa una contraseña.';
      isValid = false;
    }
    if (isValid) {
      try {
        const resultado = await registerUser(name, email, password);
        console.log(resultado, 'resultado');
        navigateTo('/feed');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          errorEmail.textContent = 'El correo electrónico ya está en uso.';
        } else if (error.code === 'auth/invalid-email') {
          errorEmail.textContent = 'El correo electrónico es incorrecto.';
        } else if (error.code === 'auth/weak-password') {
          errorPassword.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (error.code === 'auth/username-already-in-use') {
          errorName.textContent = 'El nombre de usuario ya está en uso.';
        } else {
          console.error(error);
        }
      }
    }
    console.log('final del event listener');
  });
  foundAccountA.addEventListener('click', () => {
    navigateTo('/signin');
  });
  googleBtn.addEventListener('click', () => {
    googleLogin(navigateTo);
  });
  signUpTxt.textContent = 'Regístrate';
  communityTxt.textContent = 'Y sé parte de la comunidad';
  userLabel.textContent = 'Nombre de usuario:';
  emailLabel.textContent = 'Correo electrónico:';
  passwordLabel.textContent = 'Contraseña:';
  readyBtn.textContent = 'Regístrate';
  foundAccount.textContent = '¿Ya tienes una cuenta?';
  foundAccountA.textContent = 'Inicia sesión';
  googleTxt.textContent = 'O ingresa con:';
  logoArticle.appendChild(logoImg);
  signUpTxtSpan.appendChild(signUpTxt);
  communityTxtSpan.appendChild(communityTxt);
  signUpSection.appendChild(logoArticle);
  signUpSection.appendChild(signUpTxtSpan);
  signUpSection.appendChild(communityTxtSpan);
  signUpForm.appendChild(userLabel);
  signUpForm.appendChild(userInput);
  signUpForm.appendChild(errorName);
  signUpForm.appendChild(emailLabel);
  signUpForm.appendChild(emailInput);
  signUpForm.appendChild(errorEmail);
  signUpForm.appendChild(passwordLabel);
  signUpForm.appendChild(passwordInput);
  signUpForm.appendChild(errorPassword);
  signUpForm.appendChild(readyBtn);
  signUpSection.appendChild(signUpForm);
  signUpSection.appendChild(divForm);
  divForm.appendChild(signUpForm);
  divForm.appendChild(foundAccountDiv);
  foundAccountDiv.appendChild(foundAccount);
  foundAccountDiv.appendChild(foundAccountA);
  divForm.appendChild(googleTxt);
  googleBtn.appendChild(googleLogo);
  divForm.appendChild(googleBtn);
  signUpSection.appendChild(logoArticle);
  signUpSection.appendChild(signUpTxtSpan);
  signUpSection.appendChild(communityTxtSpan);
  signUpSection.appendChild(divForm);
  return signUpSection;
};
export default signup;
