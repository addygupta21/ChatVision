import React from 'react'
import {useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { axiosClient } from './axiosclient';

function Signup() {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Helper function to delay execution
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validate inputs
    if (!email || !password || !name) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with:', { email, name });
      
      const signupResult = await axiosClient.post('/auth/signup', {
        email,
        password,
        name
      });

      console.log('Signup response:', signupResult);
      
      // Check if signup was successful
      if (signupResult.data?.status === 'error') {
        throw new Error(signupResult.data.message || 'Signup failed');
      }

      if (!signupResult.data) {
        throw new Error('No data received from server');
      }

      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      
      try {
        // Add a 2-second delay before attempting login
        console.log('Waiting 2 seconds before login attempt...');
        await delay(2000);
        
        console.log('Attempting automatic login after signup');
        const loginResult = await axiosClient.post('/auth/login', {
          email,
          password
        });
        
        console.log('Login response:', loginResult);
        
        if (loginResult.data?.status === 'error') {
          console.error('Login error response:', loginResult.data);
          throw new Error(loginResult.data.message || 'Login failed: Server returned an error');
        }
        
        if (!loginResult.data?.result?.accessToken) {
          console.error('Invalid login response structure:', loginResult.data);
          throw new Error('Login failed: Invalid response format');
        }
        
        localStorage.setItem("KEY_ACCESS_TOKEN", loginResult.data.result.accessToken);
        localStorage.setItem("user_email", email);
        navigate('/');
      } catch (loginError) {
        console.error('Login error after signup:', {
          error: loginError,
          response: loginError.response?.data,
          status: loginError.response?.status
        });
        
        let errorMessage = 'Login failed after signup. Please try logging in manually.';
        if (loginError.response?.data?.message) {
          errorMessage = loginError.response.data.message;
        } else if (loginError.message) {
          errorMessage = loginError.message;
        }
        setError(errorMessage);
      }
    } catch (signupError) {
      console.error('Signup error details:', signupError);
      // Extract error message from the response if available
      let errorMessage;
      if (signupError.response?.data?.message) {
        const message = signupError.response.data.message;
        errorMessage = typeof message === 'object' && Object.keys(message).length > 0
          ? JSON.stringify(message)
          : (typeof message === 'string' ? message : 'Signup failed: Server returned an error');
      } else if (signupError.message) {
        errorMessage = signupError.message;
      } else {
        errorMessage = 'Signup failed. Please check your details and try again.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="h-16 w-16 mr-2" src={require('./images/newim.png')} alt="logo"/>
          ChatVision    
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create new account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                <input 
                  type="name" 
                  name="name" 
                  id="name" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="Priyanshu" 
                  required 
                  value={name} 
                  onChange={(e)=>setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="abs@123.com" 
                  required 
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="••••••••" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  required 
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={isLoading}
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup