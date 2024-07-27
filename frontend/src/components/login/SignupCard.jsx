import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/connect.png';
import { AuthContext } from '../../context/Auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import PasswordStrengthBar from 'react-password-strength-bar';
import { url } from '../../baseUrl';

const signupSchema = z.object({
  email: z.string().email('Invalid email address').nonempty('Email is required'),
  name: z.string().nonempty('Full name is required'),
  username: z.string().nonempty('Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().nonempty('Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export const SignupCard = () => {
  const context = useContext(AuthContext);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password'); // Watch the password field to pass it to the PasswordStrengthBar

  const onSubmit = async (data) => {
    console.log(data);  // Log the data to ensure confirmPassword is included
    try {
      const response = await axios.post(`${url}/auth/register`, data); // Send the full data, including confirmPassword
      context.setAuth(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        err.response.data.errors.forEach(error => {
          context.throwErr(error.msg);
        });
      } else {
        context.throwErr(err.response.data.message);
      }
    }
  };

  return (
    <div className="right-logins">
      <div className="signup-box" style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div className='' style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <img style={{ width: '15%' }} src={logo} alt="" />
        </div>
        <p style={{ marginTop: '0px', color: 'gray', fontSize: '15px', marginBottom: '10px', width: '70%', textAlign: 'center', fontWeight: 'bold' }}>Sign up</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('email')} className='border' style={{ marginTop: '15px', width: '75%', height: '37px', fontSize: '13px', backgroundColor: '#fafafa ', outline: 'none', borderRadius: '5px' }} type="text" placeholder='Email address' />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
          
          <input {...register('name')} className='border' style={{ marginTop: '15px', width: '75%', height: '37px', fontSize: '13px', backgroundColor: '#fafafa ', outline: 'none', borderRadius: '5px' }} type="text" placeholder='Full Name' />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
          
          <input {...register('username')} className='border' style={{ marginTop: '15px', width: '75%', height: '37px', fontSize: '13px', backgroundColor: '#fafafa ', outline: 'none', borderRadius: '5px' }} type="text" placeholder='Username' />
          {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
          
          <input {...register('password')} className='border' style={{ marginTop: '15px', width: '75%', height: '37px', fontSize: '13px', backgroundColor: '#fafafa ', outline: 'none', borderRadius: '5px' }} type="password" placeholder='Password' />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
          
          <div style={{ width: '75%', marginTop: '10px' }}> {/* Adjust the width to match the input fields */}
            <PasswordStrengthBar password={password} />
          </div>
          
          <input {...register('confirmPassword')} className='border' style={{ marginTop: '15px', width: '75%', height: '37px', fontSize: '13px', backgroundColor: '#fafafa ', outline: 'none', borderRadius: '5px' }} type="password" placeholder='Confirm Password' />
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
          
          <p style={{ color: 'gray', fontSize: '12px', textAlign: 'center', width: '78%', marginTop: '17px' }}>
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </p>
          
          <button type="submit" style={{ border: 'none', outline: 'none', background: 'blue', padding: '7px 9px', borderRadius: '5px', color: 'white', backgroundColor: '#2196f3', marginTop: '18px', fontSize: '13.85px', width: '75%', fontWeight: 'bold' }}>Sign Up</button>
        </form>
      </div>
      <div className=" border" style={{ textAlign: 'center' }}>
        <p style={{ color: 'gray', fontSize: '14px' }}>Have an account?<Link to="/login" style={{ color: '#2196f3', fontWeight: 'bold', marginLeft: '6px', textDecoration: 'none', fontSize: '13.5px' }}>Log in</Link></p>
      </div>
    </div>
  );
};
