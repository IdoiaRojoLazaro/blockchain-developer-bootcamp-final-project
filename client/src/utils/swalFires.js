import Swal from 'sweetalert2';

const swalConnectionMetamask = () =>
  Swal.fire({
    icon: 'warning',
    title: 'Connecting to metamask',
    showCloseButton: false,
    showConfirmButton: false,
    allowOutsideClick: false
  });

const swalWaitingTxn = () =>
  Swal.fire({
    icon: 'info',
    title: 'Waiting for transaction',
    text: 'This could take some minutes, please be patient',
    showCloseButton: false,
    showConfirmButton: false,
    allowOutsideClick: false
  });

const swalSuccess = title =>
  Swal.fire({
    icon: 'success',
    title: title
  });

const swalError = (err, title = 'There was an error during transaction') =>
  Swal.fire(title, err, 'error');

export { swalConnectionMetamask, swalWaitingTxn, swalSuccess, swalError };
