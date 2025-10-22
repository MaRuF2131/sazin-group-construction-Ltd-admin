'use client';
import axiosInstance from '@/utils/axios';
import {
  EmailValidationCheck,
  PasswordValidationCheck,
} from '@/utils/custom-validation/CustomValidation';
import CryptoJS from 'crypto-js';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';

// Encryption function
const encryptData = (data) => {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

function ChangePassForm({ closeModal }) {
  const [showPassword, setShowPassword] = useState(false);
  const [NewshowPassword, setNewShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
    shouldUnregister: true,
    criteriaMode: 'all',
  });

  const encryptField = ['email', 'password', 'newpassword'];

  const PassChange = async (data) => {
    const formdata = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (!encryptField.includes(key)) {
        formdata.append(key, value);
      } else {
        const enc = encryptData(value);
        formdata.append(key, enc);
      }
    });
    try {
      const res = await axiosInstance.post('/Auth0782T/changePass', formdata);
      toast.success(res?.data?.message);
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || 'request failed';
      if (!message) return;
      if (typeof message === 'string') {
        toast.error(message);
      } else if (Array.isArray(message)) {
        message.forEach((msg) => toast.error(msg));
      } else if (typeof message === 'object') {
        Object.values(message).forEach((val) => {
          if (Array.isArray(val)) {
            val.forEach((msg) => toast.error(msg));
          } else {
            toast.error(val);
          }
        });
      }
      throw error;
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await PassChange(data);
      setIsLoading(false);
      reset();
      closeModal(false);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
            Change Password 🔐
          </h2>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                {...register('email', {
                  required: 'Email is required',
                  ...EmailValidationCheck,
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Current Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Current Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                {...register('password', {
                  required: 'Password is required',
                  ...PasswordValidationCheck,
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newpassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                id="newpassword"
                type={NewshowPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                {...register('newpassword', {
                  required: 'New password is required',
                  ...PasswordValidationCheck,
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500"
                onClick={() => setNewShowPassword(!NewshowPassword)}
              >
                {NewshowPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newpassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newpassword.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgottenPass"
              className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              Forgot password?
            </Link>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                      5.291A7.962 7.962 0 014 12H0c0
                      3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </button>

            <button
              type="button"
              onClick={() => closeModal(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ChangePassForm;
