import React from 'react';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import { store } from './store/store';
import { AppRouter } from './router/AppRouter';

// import { Web3ReactProvider } from '@web3-react/core';
// import { ethers } from 'ethers';
// import Header from './components/Header';
// import { AppContextProvider } from './AppContext';

// function getLibrary(provider) {
//   return new ethers.providers.Web3Provider(provider);
// }

const DApp = () => {
  return (
    // <AppContextProvider>
    //   <Web3ReactProvider getLibrary={getLibrary}>
    //     <AppRouter />
    //   </Web3ReactProvider>
    // </AppContextProvider>

    <Provider store={store}>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </Provider>
  );
};

export default DApp;
