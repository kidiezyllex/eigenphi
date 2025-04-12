import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, register, getProfile } from '@/api/authentication';
import { ISignIn, IRegister } from '@/interface/request/authentication';
import { IAuthResponse, IProfileResponse } from '@/interface/response/authentication';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<IProfileResponse | null>(null);

  const handleLogin = async (credentials: ISignIn) => {
    setLoading(true);
    setError(null);
    try {
      const response = await signIn(credentials);
      // Lưu token vào localStorage hoặc cookie
      localStorage.setItem('token', response.token);
      // Lấy thông tin profile
      await fetchUserProfile();
      router.push('/dashboard');
      return response;
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: IRegister) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(userData);
      // Lưu token vào localStorage hoặc cookie
      localStorage.setItem('token', response.token);
      // Lấy thông tin profile
      await fetchUserProfile();
      router.push('/dashboard');
      return response;
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userProfile = await getProfile();
      setUser(userProfile);
      return userProfile;
    } catch (err: any) {
      setError(err.message || 'Không thể lấy thông tin người dùng');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    error,
    handleLogin,
    handleRegister,
    fetchUserProfile,
    logout
  };
}; 