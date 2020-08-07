import React, { Children } from 'react';
import SignIn  from '../../pages/SignIn';
import { render, fireEvent, wait } from "@testing-library/react";

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();
/* mocka a funcao useHistory retornando um funcao vazia
   Link é um componente que recebe children e tem algum conteudo dentro dele
   ReactNode é uma tipagem do TS que é um conteúdo que qualquer componente React poderia receber
**/
jest.mock('react-router-dom', () => {
  return {
    // useHistory: jest.fn(),
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode}) => children,
  }
})


jest.mock('../../hooks/auth', () => { //mockando funcoes de fora de nosso codigo
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    })
  }
})




jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    })
  }
});

describe('SignIn Page', () => {
    beforeEach(() => {
      mockedHistoryPush.mockClear();
    });

  it('should be able to sign in ', async () => {
      const { debug, getByPlaceholderText, getByText } = render(<SignIn />);
      //debug();

      const emailField = getByPlaceholderText('E-mail');
      const passwordField = getByPlaceholderText('Password');
      const buttonElement = getByText('Enter');

      fireEvent.change(emailField, {target: { value: 'john@doe.com' }}); //porque eu recebo um evento que tem um target e aí sim tenho o texto.
      fireEvent.change(passwordField, {target: { value: '123456' }});

      fireEvent.click(buttonElement);

      await wait(() => {
        expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      });
  });

  it ('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render (<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Enter');

    fireEvent.change(emailField, {target: {value: 'not-valid-email'}});
    fireEvent.change(passwordField, {target: {value: '123456'}});

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display a message if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });



    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Enter');

    fireEvent.change(emailField, {target: {value: 'john@doe.com'}});
    fireEvent.change(passwordField, {target: {value: '123456'}});

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error'
        })
      );
    });

  });


})

