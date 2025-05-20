import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import { useUserStore } from '../lib/store';
import { supabase } from '../lib/supabase';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address').optional(),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfileForm } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });
  
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });
  
  // Update profile handler
  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.fullName,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        full_name: data.fullName,
        phone: data.phone,
        updated_at: new Date().toISOString(),
      });
      
      setUpdateSuccess(true);
      setUpdateError('');
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update profile');
      setUpdateSuccess(false);
    }
  };
  
  // Change password handler
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) throw error;
      
      setPasswordSuccess(true);
      setPasswordError('');
      setIsChangingPassword(false);
      resetPasswordForm();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
      setPasswordSuccess(false);
    }
  };
  
  const handleEditProfile = () => {
    resetProfileForm({
      fullName: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateError('');
  };
  
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordError('');
    resetPasswordForm();
  };
  
  if (!user) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-6">
          My Profile
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Profile info */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="p-6 border-b border-stone-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold font-serif">Profile Information</h2>
                  
                  {!isEditing && (
                    <button
                      onClick={handleEditProfile}
                      className="text-primary-700 hover:text-primary-800 font-medium text-sm"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {updateSuccess && (
                  <div className="mb-6 bg-success-50 text-success-700 p-4 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Profile updated successfully!
                  </div>
                )}
                
                {updateError && (
                  <div className="mb-6 bg-error-50 text-error-700 p-4 rounded-lg">
                    {updateError}
                  </div>
                )}
                
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-stone-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="w-5 h-5 text-stone-400" />
                        </div>
                        <input
                          id="fullName"
                          type="text"
                          {...registerProfile('fullName')}
                          className={`bg-white border ${
                            profileErrors.fullName ? 'border-error-500' : 'border-stone-300'
                          } text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5`}
                        />
                      </div>
                      {profileErrors.fullName && (
                        <p className="mt-1 text-sm text-error-600">{profileErrors.fullName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                        Email (cannot be changed)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="w-5 h-5 text-stone-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="bg-stone-50 border border-stone-300 text-stone-600 text-sm rounded-lg block w-full pl-10 p-2.5 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="w-5 h-5 text-stone-400" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          {...registerProfile('phone')}
                          className={`bg-white border ${
                            profileErrors.phone ? 'border-error-500' : 'border-stone-300'
                          } text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5`}
                        />
                      </div>
                      {profileErrors.phone && (
                        <p className="mt-1 text-sm text-error-600">{profileErrors.phone.message}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-primary-700 hover:bg-primary-800 text-white font-medium py-2 px-4 rounded transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2 px-4 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Full Name</p>
                      <p className="text-stone-800 font-medium">{user.full_name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Email</p>
                      <p className="text-stone-800 font-medium">{user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Phone Number</p>
                      <p className="text-stone-800 font-medium">{user.phone}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Account Type</p>
                      <p className="text-stone-800 font-medium capitalize">{user.role}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Member Since</p>
                      <p className="text-stone-800 font-medium">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Security settings */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-xl font-semibold font-serif">Security</h2>
              </div>
              
              <div className="p-6">
                {passwordSuccess && (
                  <div className="mb-6 bg-success-50 text-success-700 p-4 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Password updated successfully!
                  </div>
                )}
                
                {passwordError && (
                  <div className="mb-6 bg-error-50 text-error-700 p-4 rounded-lg">
                    {passwordError}
                  </div>
                )}
                
                {isChangingPassword ? (
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-stone-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-stone-400" />
                        </div>
                        <input
                          id="currentPassword"
                          type="password"
                          {...registerPassword('currentPassword')}
                          className={`bg-white border ${
                            passwordErrors.currentPassword ? 'border-error-500' : 'border-stone-300'
                          } text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5`}
                        />
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-error-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-stone-400" />
                        </div>
                        <input
                          id="newPassword"
                          type="password"
                          {...registerPassword('newPassword')}
                          className={`bg-white border ${
                            passwordErrors.newPassword ? 'border-error-500' : 'border-stone-300'
                          } text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5`}
                        />
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-error-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-stone-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          type="password"
                          {...registerPassword('confirmPassword')}
                          className={`bg-white border ${
                            passwordErrors.confirmPassword ? 'border-error-500' : 'border-stone-300'
                          } text-stone-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5`}
                        />
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-error-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="bg-primary-700 hover:bg-primary-800 text-white font-medium py-2 px-4 rounded transition-colors"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelPasswordChange}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2 px-4 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Password</h3>
                      <p className="text-stone-600 text-sm mb-4">
                        Update your password to keep your account secure.
                      </p>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2 px-4 rounded transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                    
                    <div className="pt-4 border-t border-stone-200">
                      <h3 className="font-medium mb-2">Account Preferences</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-stone-800">Email Notifications</p>
                          <p className="text-stone-500 text-sm">Receive updates and reminders</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;