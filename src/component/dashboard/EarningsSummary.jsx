import React from 'react';

function EarningsSummary({ earnings, completedOrderData }) {
    const totalEarnings = earnings.total || 0;
    const pendingEarnings = earnings.pending || 0;

    return (
        <div className="bg-white rounded-lg p-6 flex flex-col h-full shadow-md">
            <div className="flex-grow overflow-hidden">
                {completedOrderData && completedOrderData.length > 0 ? (
                    <>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">
                            Completed Orders Breakdown:
                        </h4>
                        <div className="overflow-y-auto h-40 scrollbar-hide">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Order Details
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Earning
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {completedOrderData.map((order, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div>
                                                    {order.gigTitle.substring(0, 20)}
                                                    {order.gigTitle.length > 20 ? '...' : ''}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    OrderID: {order.orderId.substring(0, 20)}...
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                                                ${order.price.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-600 text-center py-4 mt-4 flex-grow flex items-center justify-center">
                        No completed orders data available yet.
                    </p>
                )}
            </div>

            <div className="mt-auto pt-4 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium text-lg">Pending Clearance:</span>
                    <span className="text-yellow-600 font-bold text-xl">
                        ${pendingEarnings.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium text-lg">Total Earnings:</span>
                    <span className="text-green-600 font-bold text-xl">
                        ${totalEarnings.toFixed(2)}
                    </span>
                </div>
            </div>

            {totalEarnings === 0 &&
                pendingEarnings === 0 &&
                (!completedOrderData || completedOrderData.length === 0) && (
                    <p className="text-gray-600 text-center py-4 mt-4">
                        No earnings data available yet.
                    </p>
                )}
        </div>
    );
}

export default EarningsSummary;
