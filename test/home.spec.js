// importamos la funcion que vamos a testear
import welcomePage from '../src/pages/home.js';

/* describe('myFunction', () => {
  it('debería ser una función', () => {
    expect(typeof myFunction).toBe('function');
  });
}); */

describe('welcomePage', () => {
  it('renderiza home', () => {
    const navigateTo = jest.fn();
    document.body.append(welcomePage(navigateTo));
    const signUp = document.querySelector('.btnSignUp');
    signUp.click();
    expect(navigateTo).toHaveBeenCalledWith('/signUp');
  });
});
