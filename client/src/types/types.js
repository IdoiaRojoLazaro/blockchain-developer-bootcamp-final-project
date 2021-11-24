export const types = {
  // status
  idle: '[status] idle',
  loading: '[status] loading',
  completed: '[status] completed',
  failed: '[status] failed',

  //modals
  openModalAS: '[modals] open approve seller modal',
  closeModalAS: '[modals] close approve seller modal',

  // auth
  authNoMetamaskInstalled: '[auth] authNoMetamaskInstalled',
  authNoWeb3Injected: '[auth] authNoWeb3Injected',
  authWeb3Injected: '[auth] authWeb3Injected',
  authFinishLoading: '[auth] Finish loading metamask data',
  // auth
  authCheckingFinish: '[auth] Finish checking login state',
  authCheckingConnectionFail: '[auth] Checking connection fail',
  authStartLogin: '[auth] Start login',
  authLogin: '[auth] Login',
  authStartTokenRenew: '[auth] Start token renew',
  authLogout: '[auth] Logout',
  login: '[auth] login',

  //notes
  setNotes: '[notes] set notes'
};
