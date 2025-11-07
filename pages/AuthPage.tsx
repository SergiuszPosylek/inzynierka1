
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthForm: React.FC<{ isLogin: boolean; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; error: string | null; loading: boolean }> = ({ isLogin, onSubmit, error, loading }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Adres email
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password"  className="block text-sm font-medium text-gray-700">
                    Hasło
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400"
                >
                    {loading ? 'Przetwarzanie...' : (isLogin ? 'Zaloguj się' : 'Zarejestruj się')}
                </button>
            </div>
        </form>
    )
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    
    try {
        if (isLogin) {
            await login({ email, password });
        } else {
            await register({ email, password });
        }
        navigate('/konto');
    } catch (err) {
        console.error("Authentication failed:", err);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-secondary">
                {isLogin ? 'Zaloguj się na swoje konto' : 'Utwórz nowe konto'}
            </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                <div className="flex justify-center mb-6 border-b border-gray-200">
                    <button onClick={() => setIsLogin(true)} className={`px-4 py-2 text-sm font-medium ${isLogin ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}>Logowanie</button>
                    <button onClick={() => setIsLogin(false)} className={`px-4 py-2 text-sm font-medium ${!isLogin ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}>Rejestracja</button>
                </div>
                <AuthForm isLogin={isLogin} onSubmit={handleSubmit} error={error} loading={loading} />
            </div>
        </div>
    </div>
  );
};

export default AuthPage;
