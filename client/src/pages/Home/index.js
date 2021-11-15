import React from 'react';
import { useHistory } from 'react-router';
import { Container } from 'react-bootstrap';
import CompInteractionCard from './CompInteractionCard';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';

const Home = () => {
  const history = useHistory();

  const { isWalletConnectModalOpen } = useWalletConnectionModal();
  const notes = [
    {
      id: 1,
      name: 'Auxilio judicial',
      url: ''
    },
    {
      id: 2,
      name: 'Técnico de hacienda',
      url: ''
    }
  ];
  return (
    // <Container className="mt-5">
    //   {isWalletConnectModalOpen && <ConnectWalletModal />}
    //   <CompInteractionCard />
    // </Container>
    <div>
      <div className="notes__container">
        {notes.map((note, i) => (
          <div
            className="note"
            key={i}
            onClick={() => history.push(`/note/${note.id}`)}
          >
            <p>{note.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
