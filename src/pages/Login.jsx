import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
    const [formData, setFormData] = useState({
        userRole: "user",
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


    const handleRedioChange = (e) => {
        const { id, value, name } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name || id]: value,
        }));
    };


    const onHandleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data._id)
            toast.success('Login successful!');
            navigate('/');
        } catch (err) {
            toast.error('Invalid credentials ');
            console.error('Login error:', err.response?.data || err.message);
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-10 text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
            <form onSubmit={onHandleSubmit}>
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
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                        placeholder="your@example.com"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                        placeholder="********"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    >
                        Login
                    </button>
                    <a
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        href="/forgetpassword"
                    >
                        Forgot Password?
                    </a>
                </div>
                <p className='text-black mt-4'>Don't have an account? <Link to="/register" className="text-blue-500 hover:underline"> Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;