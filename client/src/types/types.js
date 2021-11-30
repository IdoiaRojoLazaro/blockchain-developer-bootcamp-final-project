export const types = {
  // status
  idle: '[status] idle',
  loading: '[status] loading',
  completed: '[status] completed',
  failed: '[status] failed',

  // auth
  authNoMetamaskInstalled: '[auth] authNoMetamaskInstalled',
  authNoWeb3Injected: '[auth] authNoWeb3Injected',
  authWeb3Injected: '[auth] authWeb3Injected',
  authSetAccountBalance: '[auth] authSetAccountBalance',
  authUpdateBalance: '[auth] update balance',
  authFinishLoading: '[auth] Finish loading metamask data',
  authCheckingFinish: '[auth] Finish checking login state',
  authCheckingConnectionFail: '[auth] Checking connection fail',
  authLogin: '[auth] Login',
  authLogout: '[auth] Logout',
  login: '[auth] login',

  //notes
  setNotes: '[notes] set notes',
  setNotesBought: '[notes] set notes bought',
  setUploadedNotes: '[notes] set uploaded notes',
  notesLoading: '[notes] set notes loading',
  setNoteActive: '[notes] set note active',

  //users
  setUsers: '[users] set users',
  usersLoading: '[users] set users loading'
};
