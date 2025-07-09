import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [donePass, setDonePass] = useState('');
  const [formData, setFormData] = useState({
    userRole: "user",
    username: '',
    email: '',
    password: donePass,
  });

  const handleRedioChange = (e) => {
    const { id, value, name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name || id]: value,
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    } else {
      setDonePass(formData.password)
    }

    const res = await api.post('/api/auth/register', formData);
    toast.success('Register successful!');
    navigate('/login');

    console.log('Registration Data:', res);
    // toast.success('Registration form submitted!');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto my-10 border border-slate-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">New Account</h2>
      <form onSubmit={handleSubmit}>

        <div className="flex flex-wrap gap-4 justify-center mb-4">
          {['user', 'freelancer'].map((role) => (
            <label
              key={role}
              className={`flex items-center px-6 py-3 rounded-md cursor-pointer transition duration-300 ease-in-out
                  ${formData.userRole === role
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
                }`}
            >
              <input
                type="radio"
                name="userRole"
                value={role}
                checked={formData.userRole === role}
                onChange={handleRedioChange}
                className="hidden"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2
                    ${formData.userRole === role
                    ? 'border-white bg-white'
                    : 'border-blue-500 bg-transparent'
                  }`}
              >
                {formData.userRole === role && (
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                )}
              </span>
              <span className="capitalize">{role}</span>
            </label>
          ))}
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            placeholder="your@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="shadow appearance-none border rounded-md w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="shadow appearance-none border rounded-md w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Register
          </button>
        </div>
      </form>
      <p className='text-black mt-4'>Do you have an account?
        <Link to="/login" className="text-blue-500 hover:underline"> login</Link>
      </p>
    </div>
  );
}

export default Register;