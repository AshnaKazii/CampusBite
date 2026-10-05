import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

export default function DashboardLayout() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <aside style={{ width: '250px', backgroundColor: 'white', borderRight: '1px solid var(--border)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Coffee size={24} color="var(--primary)" />
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>LA ROCHE STAFF</span>
                    </Link>
                </div>
                <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to="/staff/dashboard" style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--primary-bg)', color: 'var(--primary)', fontWeight: '600' }}>Staff Dashboard</Link>
                </nav>
            </aside>
            <main style={{ flexGrow: 1, padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
}
