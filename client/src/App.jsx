import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';

import StaffDashboard from './pages/StaffDashboard';

export default function App() {
    return (
        <GlobalProvider>
            <Router>
                <Routes>
                    {/* Public & Student Routes - La Roche Style */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                        <Route path="/orders" element={<Orders />} />
                    </Route>

                    {/* Staff Routes */}
                    <Route element={<DashboardLayout role="staff" />}>
                        <Route path="/staff/dashboard" element={<StaffDashboard />} />
                        <Route path="/cafe/dashboard" element={<Navigate to="/staff/dashboard" />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </GlobalProvider>
    );
}
