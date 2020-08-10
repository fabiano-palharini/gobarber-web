import { renderHook } from "@testing-library/react-hooks";
import { useAuth, AuthProvider } from "../../hooks/auth";
import MockAdapter from 'axios-mock-adapter';
import api from  '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John Doe',
        email: 'john@doe.com'
      },
      token: 'token-123',
    }
    apiMock.onPost('sessions').reply(200, apiResponse)

    const setItemSpy = jest.spyOn(Storage.prototype,  'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // console.log(result.current);
    result.current.signIn({
      email: 'john@doe.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', apiResponse.token);
    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:user', JSON.stringify(apiResponse.user));
    expect(setItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user.email).toEqual('john@doe.com');
  });
})
