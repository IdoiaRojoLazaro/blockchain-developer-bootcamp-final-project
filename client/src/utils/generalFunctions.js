import Swal from 'sweetalert2';

const cropAccountString = stringAccount =>
  `${stringAccount.slice(0, 5)}...${stringAccount.slice(-5)}`;

const swalConnectionMetamask = () =>
  Swal.fire({
    icon: 'info',
    title: 'Connecting to metamask'
  });

const swalWaitingTxn = () =>
  Swal.fire({
    icon: 'waiting',
    title: 'Waiting for transaction',
    text: 'This could take some minutes, please be patient'
  });

const swalSuccess = title =>
  Swal.fire({
    icon: 'success',
    title: title
  });

const swalError = err =>
  Swal.fire('There was an error during transaction', err, 'error');

export {
  cropAccountString,
  swalConnectionMetamask,
  swalWaitingTxn,
  swalSuccess,
  swalError
};
