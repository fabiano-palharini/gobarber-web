import React, { FC } from 'react';
import GlobalStyle from './styles/global';
// import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { AuthProvider } from './hooks/AuthContext';
import ToastContainer from './components/ToastContainer';

const App: FC = () => {
  return (
    <>
      <AuthProvider>
        <SignIn />
      </AuthProvider>
      <ToastContainer />
      <GlobalStyle />
    </>
  );
};

export default App;
