import Swal from 'sweetalert2';
import { logout } from '../actions/auth';

export const catchApiError = body => {
  return async dispatch => {
    if (body.auth_token_expired) {
      Swal.fire({
        icon: 'warning',
        title: 'Session expired',
        text: 'Your session expired because another user entered with your credentials',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true
      }).then(() => {
        localStorage.clear();
        dispatch(logout());
      });
    } else {
      Swal.fire('Error', body.msg, 'error');
    }
  };
};
