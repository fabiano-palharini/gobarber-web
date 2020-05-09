import React, { FC } from 'react';
import GlobalStyle from './styles/global';
import SignUp from './pages/SignUp';

const App: FC = () => {
  return (
    <>
      <SignUp />
      <GlobalStyle />
    </>
  );
};

export default App;
