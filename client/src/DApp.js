import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import Header from './components/Header';
import { AppContextProvider } from './AppContext';
import { AppRouter } from './router/AppRouter';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const DApp = () => {
  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AppRouter />
      </Web3ReactProvider>
    </AppContextProvider>
  );
};

export default DApp;
