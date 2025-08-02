import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      if (token && user) {
        // Save to state
        setUser(user);
        setToken(token);

        // Save to localStorage
        localStorage.setItem('authUser', JSON.stringify(user));
        localStorage.setItem('authToken', token);

        // Optional: Apply default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true };
      } else {
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Login error',
      };
    }
  };

  const logout = () => {
    // Clear localStorage and state
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');

    setUser(null);
    setToken(null);

    // Clear Axios auth header
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
