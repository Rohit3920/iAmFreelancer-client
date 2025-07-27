import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

import MyGigsList from '../../component/dashboard/MyGigsList';
import OrdersList from '../../component/dashboard/OrdersList';
import EarningsSummary from '../../component/dashboard/EarningsSummary';

function FreelancerDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gigs, setGigs] = useState([]);
    const [orders, setOrders] = useState([]);
    const [earnings, setEarnings] = useState({ total: 0, pending: 0 });
    const [completedOrderData, setCompletedOrderData] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userRes = await api.get(`/api/auth/${userId}`);
                const userRole = userRes.data.userRole;

                const gigsRes = await api.get(`/api/gig/user/${userRes.data._id}`);
                setGigs(gigsRes.data);

                const ordersRes = await api.get(`/api/orders/${userRes.data._id}/${userRole}`);
                const fetchedOrders = ordersRes.data.data.orders;
                setOrders(fetchedOrders);

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
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-gray-700">Loading freelancer dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-4xl font-semibold text-gray-900 mb-8">
                Freelancer Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="col-span-1 lg:col-span-2 flex flex-col">
                    <h2 className="text-3xl font-medium text-gray-800 mb-6">My Gigs</h2>
                    <div className="flex-grow h-96 overflow-y-auto">
                        <MyGigsList gigs={gigs} />
                    </div>
                </div>
                <div className="col-span-1 flex flex-col">
                    <h2 className="text-3xl font-medium text-gray-800 mb-6">Earnings</h2>
                    <div className="flex-grow h-96 border-2 border-indigo-400 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <EarningsSummary earnings={earnings} completedOrderData={completedOrderData} />
                    </div>
                </div>
                <div className="col-span-full">
                    <h2 className="text-3xl font-medium text-gray-800 mb-6">Orders for My Gigs</h2>
                    <OrdersList orders={orders} userRole="freelancer" />
                </div>
            </div>
        </div>
    );
}

export default FreelancerDashboard;