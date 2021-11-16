export const types = {
  // status
  idle: '[status] idle',
  loading: '[status] loading',
  completed: '[status] completed',
  failed: '[status] failed',

  // auth
  authCheckingFinish: '[auth] Finish checking login state',
  authCheckingConnectionFail: '[auth] Checking connection fail',
  authStartLogin: '[auth] Start login',
  authLogin: '[auth] Login',
  authStartTokenRenew: '[auth] Start token renew',
  authLogout: '[auth] Logout',
  login: '[auth] login'
};
