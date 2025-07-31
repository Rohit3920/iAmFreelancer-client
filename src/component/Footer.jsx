import React from 'react';
import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-white py-12 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>Graphics & Design</li>
                            <li>Digital Marketing</li>
                            <li>Writing & Translation</li>
                            <li>Video & Animation</li>
                            <li>Music & Audio</li>
                            <li>Programming & Tech</li>
                            <li>AI Services</li>
                            <li>Consulting</li>
                            <li>Data</li>
                            <li>Business</li>
                            <li>Personal Growth & Hobbies</li>
                            <li>Photography</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">For Clients</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>How iAmFreelancer Works</li>
                            <li>Customer Success Stories</li>
                            <li>Trust & Safety</li>
                            <li>Quality Guide</li>
                            <li>iAmFreelancer Learn - Online Courses</li>
                            <li>iAmFreelancer Guides</li>
                            <li>iAmFreelancer Answers</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">For Freelancers</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>Become an iAmFreelancer Freelancer</li>
                            <li>Become an Agency</li>
                            <li>Freelancer Equity Program</li>
                            <li>Community Hub</li>
                            <li>Forum</li>
                            <li>Events</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Business Solutions</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>iAmFreelancer Pro</li>
                            <li>Project Management Service</li>
                            <li>Expert Sourcing Service</li>
                            <li>ClearVoice - Content Marketing</li>
                            <li>Working Not Working - Creative Talent</li>
                            <li>AutoDS - Dropshipping Tool</li>
                            <li>AI store builder</li>
                            <li>iAmFreelancer Logo Maker</li>
                            <li>Contact Sales</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">About</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li>Creator Network</li>
                            <li>Affiliates</li>
                            <li>Invite a Friend</li>
                            <li>Press & News</li>
                            <li>Investor Relations</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="flex-shrink-0 mr-6">
                            <Link to="/" className="text-gray-800 text-3xl font-bold">
                                <span className="text-blue-500">i<span className='text-orange-500'>Am</span>Freelancer</span><span className='text-orange-500'>.</span>
                            </Link>
                        </div>
                        <span className="text-gray-500 text-sm">© iAmFreelancer International Ltd. 2025</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="flex space-x-4 text-gray-600 text-sm">
                            <a href="#" className="hover:underline">English</a>
                            <a href="#" className="hover:underline">USD</a>
                            <a href="#" className="hover:underline">
                                <span className="flex items-center">
                                    <Globe className="h-4 w-4 mr-1" />
                                    Accessibility
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
