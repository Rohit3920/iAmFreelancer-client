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

                setEarnings({
                    total: totalEarned,
                    pending: pendingClearance,
                });

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
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-6 mx-auto"></div>
                    <p className="text-gray-800 text-xl font-semibold">Loading your earnings data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <p className="text-red-600 text-xl font-semibold mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-24 md:mt-20 lg:mt-16">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3 flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-3">Completed Orders</h2>
                            {completedOrderData && completedOrderData.length > 0 ? (
                                <div className="flex-grow overflow-hidden">
                                    <div className="overflow-y-auto h-72 border border-gray-200 rounded-lg shadow-inner">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-indigo-50 sticky top-0">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                                                        Order Details
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                                                        Earning
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {completedOrderData.map((order, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-base font-medium text-gray-900">{order.gigTitle}</div>
                                                            <div className="text-xs text-gray-500 mt-1">Order ID: {order.orderId.substring(0, 8)}...</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-base font-semibold text-green-600">
                                                            ${order.price.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center py-10 text-lg flex-grow flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    No completed orders to display yet.
                                </p>
                            )}
                        </div>

                        <div className="lg:w-1/3 bg-indigo-50 p-6 rounded-lg shadow-inner flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-300 pb-3">Summary</h2>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                                        <span className="text-gray-700 font-semibold text-lg">Pending Clearance:</span>
                                        <span className="text-yellow-600 font-extrabold text-2xl">${earnings.pending.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                                        <span className="text-gray-700 font-semibold text-lg">Total Earned:</span>
                                        <span className="text-green-700 font-extrabold text-2xl">${earnings.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {(earnings.total === 0 && earnings.pending === 0 && (!completedOrderData || completedOrderData.length === 0)) && (
                                <p className="text-gray-600 text-center py-4 mt-6 text-md bg-white rounded-lg p-3">
                                    Start completing orders to see your earnings here!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyEarning;