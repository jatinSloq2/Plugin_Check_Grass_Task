import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });

      const { token } = res.data;
      setMessage('Login successful!');
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-green-950">
      <div className="w-full max-w-md bg-white dark:bg-green-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-700 dark:text-white mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-green-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-green-800 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-green-700 dark:text-gray-300">
              <input type="checkbox" className="accent-green-600" />
              Remember me
            </label>
            <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500 dark:text-red-400">
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-green-700 dark:text-gray-300">
          Don’t have an account?
          <a href="/signup" className="text-green-600 hover:underline ml-1">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
