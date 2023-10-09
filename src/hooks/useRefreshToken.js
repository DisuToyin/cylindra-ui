import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const { data } = await axios.get('/api/user/refresh', {
      withCredentials: true,
    });

    console.log(data?.data?.token);

    setAuth((prev) => {
      console.log(prev);
      console.log(data?.data?.token);
      return { ...prev, token: data?.data?.token };
    });
    return data;
  };
  console.log(auth);
  return refresh;
};

export default useRefreshToken;
