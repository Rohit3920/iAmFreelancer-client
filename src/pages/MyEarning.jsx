import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function MyEarning() {
    const [earnings, setEarnings] = useState({ total: 0, pending: 0 });
    const [completedOrderData, setCompletedOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userRes = await api.get(`/api/auth/${userId}`);
                const userRole = userRes.data.userRole;
                const ordersRes = await api.get(`/api/orders/${userRes.data._id}/${userRole}`);
                const fetchedOrders = ordersRes.data.data.orders;

                let totalEarned = 0;
                let pendingClearance = 0;
                const completedOrdersArray = [];

                fetchedOrders.forEach(order => {
                    if (order.status === 'completed' && typeof order.price === 'number') {
                        totalEarned += order.price;
                        completedOrdersArray.push({
                            orderId: order._id,
                            price: order.price,
                            gigTitle: order.gigId ? order.gigId.title : 'N/A'
                        });
                        if (order.paymentStatus === 'pending_clearance') {
                            pendingClearance += order.price;
                        }
                    }
                });

                setEarnings({ total: totalEarned, pending: pendingClearance });
                setCompletedOrderData(completedOrdersArray);
            } catch (err) {
                console.error('Error fetching freelancer data:', err);
                setError('Failed to load freelancer dashboard data.');
                toast.error('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        } else {
            setError('User ID not found. Please log in.');
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200">
                <div className="text-center p-10 bg-white rounded-2xl shadow-2xl">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-6 mx-auto"></div>
                    <p className="text-gray-900 text-xl font-bold">Fetching your earnings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-100 to-red-200">
                <div className="text-center p-10 bg-white rounded-2xl shadow-2xl">
                    <p className="text-red-700 text-2xl font-bold mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-800 transition duration-300 transform hover:scale-105"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-16 px-6 lg:px-12">
            <h2 className="text-3xl font-extrabold text-indigo-900 mb-8 border-b-4 border-indigo-400 pb-4">Earnings Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="flex flex-col justify-center items-center bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
                    <span className="text-gray-600 font-medium text-lg mb-2">Pending Clearance</span>
                    <span className="text-yellow-500 font-extrabold text-4xl">${earnings.pending.toFixed(2)}</span>
                </div>
                <div className="flex flex-col justify-center items-center bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
                    <span className="text-gray-600 font-medium text-lg mb-2">Total Earned</span>
                    <span className="text-green-600 font-extrabold text-4xl">${earnings.total.toFixed(2)}</span>
                </div>
            </div>
            {(earnings.total === 0 && earnings.pending === 0 && (!completedOrderData || completedOrderData.length === 0)) && (
                <p className="text-gray-600 text-center py-6 mt-6 text-lg bg-white rounded-xl border border-dashed border-gray-400">
                    You haven’t earned anything yet — start completing orders!
                </p>
            )}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-indigo-300 pb-3">Completed Orders</h2>
                {completedOrderData && completedOrderData.length > 0 ? (
                    <div className="overflow-hidden rounded-xl shadow-lg border border-gray-300">
                        <div className="overflow-y-auto h-80">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-indigo-100 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                            Order Details
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-indigo-800 uppercase tracking-wider">
                                            Earning
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {completedOrderData.map((order, index) => (
                                        <tr key={index} className="hover:bg-indigo-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="text-base font-semibold text-gray-900">{order.gigTitle}</div>
                                                <div className="text-xs text-gray-500 mt-1">Order ID: {order.orderId.substring(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-base font-bold text-green-600">
                                                ${order.price.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-10 text-lg bg-white rounded-xl border border-dashed border-gray-400">
                        No completed orders available.
                    </p>
                )}
            </div>
        </div>
    );
}

export default MyEarning;
