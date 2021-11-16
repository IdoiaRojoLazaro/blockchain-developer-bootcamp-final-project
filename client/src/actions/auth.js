import { fetchWithToken, fetchNoToken } from '../helpers/fetch';
import { types } from '../types/types';
import Swal from 'sweetalert2';
import { catchApiError } from '../helpers/catchApiError';

export const startLogin = (email, password) => {
  return async dispatch => {
    const resp = await fetchNoToken(
      'admin/sessions',
      {
        user: { email, password }
      },
      'POST'
    );
    const body = await resp.json();
    if (body.success) {
      localStorage.setItem('email', email);
      localStorage.setItem('token', body.data.auth_token);
      localStorage.setItem('token-init-date', new Date().getTime());
      const { uid, name, roles } = body.data.user;
      dispatch(
        login({
          uid: uid,
          email: email,
          name: name,
          roles: roles
        })
      );
      return body;
    } else {
      return body;
      // dispatch(catchApiError(body));
    }
  };
};
const login = user => ({
  type: types.authLogin,
  payload: user
});

export const startChecking = () => {
  // TO-DO mirar que no puedan entrar con el token de partner
  const token = localStorage.getItem('token') || '';
  const email = localStorage.getItem('email') || '';

  return async dispatch => {
    const resp = await fetchNoToken(
      'admin/users/check_token',
      { email, token },
      'POST'
    );
    const body = await resp.json();
    if (body.success) {
      const { uid, name, roles } = body.user;
      dispatch(
        login({
          uid: uid,
          email: email,
          name: name,
          roles: roles
        })
      );
    } else {
      if (body.msg) {
        Swal.fire('Error', body.msg, 'error');
      }
      dispatch(checkingFinish());
    }
  };
};

const checkingFinish = () => ({ type: types.authCheckingFinish });
export const connectionFail = () => ({
  type: types.authCheckingConnectionFail
});

export const startLogout = () => {
  return async dispatch => {
    const resp = await fetchWithToken('admin/sessions', {}, 'DELETE');
    const body = await resp.json();
    if (body) {
      localStorage.clear();
      dispatch(logout());
    } else {
      if (body.msg) {
        dispatch(catchApiError(body));
        Swal.fire('Error', body.msg, 'error');
      }
    }
  };
};

export const logout = () => ({ type: types.authLogout });
