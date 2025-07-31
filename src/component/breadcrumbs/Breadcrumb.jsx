import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumb() {
    const { pathname } = useLocation();
    const pathnames = pathname.split('/').filter((x) => x);

    const shouldShowDashboardLink = pathnames.length > 0 && pathnames[0] !== 'my-dashboard';

    return (
        <>
        {
            !pathnames.length == 0 &&
        <nav className="text-left ml-10">
            <ol className="list-none p-0 inline-flex items-center">
                <li className="flex items-center">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                        Home
                    </Link>
                    {
                        shouldShowDashboardLink && (
                            <>
                                <span className='mx-2 text-gray-500'>/</span>
                                <Link to="/my-dashboard" className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">
                                    Dashboard
                                </Link>
                            </>
                        )
                    }
                </li>

                {pathnames.map((name, index) => {
                    // const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    if (name === 'my-dashboard' && index === 0 && shouldShowDashboardLink) {
                        return null;
                    }

                    return (
                        <li key={name} className="flex items-center">
                            <span className="mx-2 text-gray-500">/</span>
                            {isLast ? (
                                <span className="text-gray-700 font-medium capitalize">
                                    {name.replace(/-/g, ' ')}
                                </span>
                            ) : (
                                <span
                                    // to={routeTo}
                                    className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out capitalize"
                                >
                                    {name.replace(/-/g, ' ')}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
        }
        </>
    );
}

export default Breadcrumb;