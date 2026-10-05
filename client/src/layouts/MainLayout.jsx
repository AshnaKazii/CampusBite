import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, Coffee, User } from 'lucide-react';
import { GlobalContext } from '../context/GlobalContext';

export default function MainLayout() {
    const { cart, user, logout } = useContext(GlobalContext);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={styles.header}>
                <div className="container" style={styles.nav}>
                    <Link to="/" style={styles.brand}>
                        <Coffee size={28} color="var(--primary)" />
                        <div>
                            <div style={styles.collegeName}>SHAH & ANCHOR KUTCHHI ENGINEERING COLLEGE</div>
                            <div style={styles.brandName}>LA ROCHE CAFE</div>
                        </div>
                    </Link>

                    <nav style={styles.navLinks}>
                        <Link to="/menu" style={styles.link}>Menu</Link>

                        <Link to="/cart" style={styles.cartLink}>
                            <ShoppingBag size={24} />
                            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                        </Link>

                        {user ? (
                            <div style={styles.userMenu}>
                                <Link to="/orders" style={styles.link}>My Orders</Link>
                                {user.role === 'staff' && <Link to="/cafe/dashboard" style={styles.link}>Staff</Link>}
                                <button onClick={logout} style={styles.link}>Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Login</Link>
                        )}
                    </nav>
                </div>
            </header>

            <main style={{ flexGrow: 1, padding: '2rem 0', backgroundColor: 'var(--bg-color)', paddingTop: '90px' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

const styles = {
    header: {
        backgroundColor: 'white',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 0',
        position: 'fixed',
        top: 0, width: '100%', zIndex: 50
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    collegeName: {
        fontSize: '0.65rem',
        fontWeight: '700',
        letterSpacing: '0.5px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase'
    },
    brandName: {
        fontSize: '1.25rem',
        fontWeight: '800',
        color: 'var(--primary)',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    link: {
        fontWeight: '600',
        color: 'var(--text-main)',
    },
    cartLink: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        color: 'var(--text-main)',
    },
    badge: {
        position: 'absolute',
        top: '-8px', right: '-8px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        width: '20px', height: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%'
    },
    userMenu: { display: 'flex', gap: '1.5rem', alignItems: 'center' }
};
