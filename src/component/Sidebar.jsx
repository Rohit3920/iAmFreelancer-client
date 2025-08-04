import React, { useEffect, useState } from 'react';
import {
    User,
    MessageSquare,
    Briefcase,
    ShoppingCart,
    DollarSign,
    LogOut,
    LayoutDashboard,
    ChevronUp,
    ChevronDown,
    Home,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '../utils/api';

function Sidebar({ mobile }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(null);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log me out!',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                toast.success('Logged out successfully!');
                navigate('/login');
            }
        });
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                if (userId) {
                    const res = await api.get(`/api/auth/${userId}`);
                    setUserRole(res.data.userRole);
                }
            } catch (err) {
                console.error('Failed to fetch user role:', err);
            }
        };
        fetchUserRole();

        const handleStorageChange = () => {
            setUserId(localStorage.getItem('userId'));
            setIsLoggedIn(!!localStorage.getItem('token'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [userId]);

    const commonLinks = [
        { name: 'Home', path: '/', icon: <Home className="w-6 h-6" /> },
        { name: 'My Profile', path: `/profile/${userId}`, icon: <User className="w-6 h-6" /> },
        { name: 'My Dashboard', path: '/my-dashboard', icon: <LayoutDashboard className="w-6 h-6" /> },
        { name: 'Messages', path: '/user/messages', icon: <MessageSquare className="w-6 h-6" /> },
        { name: 'Orders', path: '/my-order', icon: <ShoppingCart className="w-6 h-6" /> },
    ];

    const freelancerLinks = [
        { name: 'My Gigs', path: `/view-gigs/${userId}`, icon: <Briefcase className="w-6 h-6" /> },
        { name: 'Earnings', path: '/My-Earning', icon: <DollarSign className="w-6 h-6" /> },
    ];

    const clientLinks = [
        { name: 'Browse Gigs', path: '/', icon: <Briefcase className="w-6 h-6" /> },
    ];

    const navLinks = [
        ...commonLinks,
        ...(userRole === 'freelancer' ? freelancerLinks : []),
        ...(userRole === 'client' ? clientLinks : []),
    ];

    if (!isLoggedIn) return null;

    return (
        <>
            <aside
                className={`${
                    mobile
                        ? `fixed top-0 left-0 h-full w-64 bg-white z-40 shadow-xl transform transition-transform duration-300 ${
                            isOpen ? 'translate-x-0' : '-translate-x-full'
                        } md:hidden`
                        : `hidden md:flex md:flex-col md:items-center md:w-20 md:h-full md:bg-white md:shadow-lg`
                }`}
            >
                <div className="flex flex-col items-start space-y-6 flex-grow mt-16 px-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => mobile && setIsOpen(false)}
                            className="flex items-center gap-4 text-gray-700 hover:text-black font-medium transition-colors md:relative md:w-full md:justify-center group"
                        >
                            {({ isActive }) => (
                                <>
                                    {React.cloneElement(link.icon, {
                                        className: `w-6 h-6 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`,
                                    })}
                                    {mobile && <span>{link.name}</span>}
                                    {!mobile && (
                                        <div className="absolute left-full ml-4 whitespace-nowrap bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {link.name}
                                        </div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div
                    className="mt-auto flex items-center gap-4 px-6 py-4 cursor-pointer text-red-600 hover:text-red-700 font-medium md:relative md:w-full md:justify-center group"
                    onClick={handleLogout}
                >
                    <LogOut className="w-6 h-6" />
                    {mobile && <span>Logout</span>}
                    {!mobile && (
                        <div className="absolute left-full ml-4 whitespace-nowrap bg-gray-800 text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Logout
                        </div>
                    )}
                </div>
            </aside>

            {mobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed bottom-6 left-6 md:hidden bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50"
                >
                    {isOpen ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
                </button>
            )}

            {mobile && isOpen && (
                <div
                    className="fixed inset-0 bg-transparent bg-opacity-40 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
}

export default Sidebar;