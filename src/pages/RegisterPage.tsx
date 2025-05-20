import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserStore } from '../lib/store';
import { Loader } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { signUp, isLoading, error } = useUserStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await signUp(
        data.email, 
        data.password, 
        {
          full_name: data.fullName,
          phone: data.phone,
          email: data.email,
          role: 'customer',
        }
      );
      navigate('/');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Create your account</h2>
      <p className="text-stone-600 mb-8">Join us to start booking restaurant reservations</p>
      
      {error && (
        <div className="bg-error-50 text-error-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-stone-700 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className={`w-full px-3 py-2 border ${
              errors.fullName ? 'border-error-500' : 'border-stone-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-error-600">{errors.fullName.message}</p>
          )}
        </div>
        
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
          <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={`w-full px-3 py-2 border ${
              errors.phone ? 'border-error-500' : 'border-stone-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="(123) 456-7890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
            Password
          </label>
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
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`w-full px-3 py-2 border ${
              errors.confirmPassword ? 'border-error-500' : 'border-stone-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <div className="mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin w-5 h-5 mr-2" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
        
        <p className="text-center text-stone-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-700 hover:text-primary-800">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;