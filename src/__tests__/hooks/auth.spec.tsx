import { renderHook } from "@testing-library/react-hooks";
import { useAuth, AuthProvider } from "../../hooks/auth";

describe('Auth hook', () => {
  it('should be able to sign in', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // console.log(result.current);
    result.current.signIn({
      email: 'john@doe.com',
      password: '123456',
    });

    expect(result.current.user.email).toEqual('john@doe.com');
  });
})