import React, { Children } from 'react';
import SignIn  from '../../pages/SignIn';
import { render } from "@testing-library/react";

/* mocka a funcao useHistory retornando um funcao vazia
   Link é um componente que recebe children e tem algum conteudo dentro dele
   ReactNode é uma tipagem do TS que é um conteúdo que qualquer componente React poderia receber
**/

jest.mock('react-router-dom', () => {
  return {
    useHistory: jest.fn(),
    Link: ({ children }: { children: React.ReactNode}) => children,
  }
})

describe('SignIn Page', () => {
  it('should be able to sign in ', () => {
      const { debug } = render(<SignIn />);
      debug();
  });
})
