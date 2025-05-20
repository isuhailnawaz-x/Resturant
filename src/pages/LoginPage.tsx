import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserStore } from '../lib/store';
import { Loader } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { signIn, isLoading, error } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Welcome back</h2>
      <p className="text-stone-600 mb-8">Sign in to continue to your account</p>
      
      {error && (
        <div className="bg-error-50 text-error-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-3 py-2 border ${
              errors.email ? 'border-error-500' : 'border-stone-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <a href="#" className="text-sm text-primary-700 hover:text-primary-800">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full px-3 py-2 border ${
              errors.password ? 'border-error-500' : 'border-stone-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin w-5 h-5 mr-2" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
        
        <p className="text-center text-stone-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-700 hover:text-primary-800">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;