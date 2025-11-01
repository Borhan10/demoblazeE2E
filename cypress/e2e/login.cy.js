import homePage from '../pages/homePage';
import loginPage from '../pages/loginPage';
import { userData } from '../fixtures/userData';

const homeObject = new homePage();
const loginObject = new loginPage();

describe('Authentication suite', () => {
  beforeEach(() => {
    homeObject.visit();
  });

  it('Verify that user can login successfully', () => {
    homeObject.openLoginModal();
    loginObject.login(
      userData.existingUser.username,
      userData.existingUser.password
    );
    loginObject.verifyLoginSuccess(userData.existingUser.username);
  });

  it('Verify that user cannot login with invalid username', () => {
    homeObject.openLoginModal();
    loginObject.login(userData.invalidUsername, userData.invalidPassword);
    loginObject.verifyLoginError();
  });

  it('Verify that user cannot login with invalid password', () => {
    homeObject.openLoginModal();
    loginObject.login(userData.existingUser.username, userData.invalidPassword);
    loginObject.verifyLoginError();
  });

  it('Verify that user cannot login with empty fields', () => {
    homeObject.openLoginModal();
    loginObject.pressLogin();
    loginObject.verifyLoginError();
  });

  it('Verify that user can logout successfully', () => {
    homeObject.openLoginModal();
    loginObject.login(
      userData.existingUser.username,
      userData.existingUser.password
    );
    loginObject.verifyLoginSuccess(userData.existingUser.username);
    loginObject.logout();
    loginObject.verifyLogoutSuccess();
  });
});
