import React, { FC } from 'react';
import GlobalStyle from './styles/global';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

const App: FC = () => {
  return (
    <>
      <SignIn />
      <GlobalStyle />
    </>
  );
};

export default App;
