import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

export default function Orders() {
    const { user } = useContext(GlobalContext);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let intervalId;

        const fetchOrders = () => {
            if (user) {
                orderService.getMyOrders().then(data => {
                    setOrders(data);

                    const hasActive = data.some(o => !['COLLECTED', 'CANCELLED'].includes(o.orderStatus));
                    if (!hasActive && intervalId) {
                        clearInterval(intervalId);
                    }
                }).catch(console.error);
            }
        };

        fetchOrders();

        if (user) {
            intervalId = setInterval(fetchOrders, 3500);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [user]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                const res = await orderService.cancelOrder(orderId);
                setOrders(prev => prev.map(o => o._id === orderId ? res.order : o));
            } catch (err) {
                alert(err.message || 'Error cancelling order.');
            }
        }
    };

    if (!user) return <div className="text-center mt-4">Please log in to view orders.</div>;

    if (orders.length === 0) {
        return (
            <div className="animate-fade text-center" style={{ padding: '4rem 0' }}>
                <h2>No orders yet</h2>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/menu')}>Start Ordering</button>
            </div>
        );
    }

    return (
        <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="font-bold mb-4" style={{ fontSize: '2rem' }}>My Orders</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div key={order._id} className="card" style={{ padding: '2rem' }}>
                        <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                            <div>
                                <div className="font-bold" style={{ fontSize: '1.5rem' }}>Order {order.orderNumber}</div>
                                <div className="text-muted">Pickup: {order.pickupType === 'ASAP' ? 'ASAP' : order.pickupTime}</div>
                            </div>
                            <div style={{
                                padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 'bold',
                                background: order.orderStatus === 'READY' ? '#dcfce7' : order.orderStatus === 'PREPARING' ? '#fef3c7' : order.orderStatus === 'CANCELLED' ? '#fee2e2' : 'var(--bg-color)',
                                color: order.orderStatus === 'READY' ? '#166534' : order.orderStatus === 'PREPARING' ? '#92400e' : order.orderStatus === 'CANCELLED' ? '#991b1b' : 'var(--text-main)'
                            }}>
                                {order.orderStatus}
                            </div>
                        </div>

                        {(order.orderStatus === 'PLACED' || order.orderStatus === 'ACCEPTED') && (
                            <div className="mb-4 text-right" style={{ textAlign: 'right' }}>
                                <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--danger)',
                                        border: '1px solid var(--danger)',
                                        padding: '0.4rem 1rem',
                                        borderRadius: 'var(--radius)',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    CANCEL ORDER
                                </button>
                            </div>
                        )}

                        {order.orderStatus === 'READY' && (
                            <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', textAlign: 'center' }}>
                                <h3 className="font-bold text-xl">YOUR ORDER IS READY! 🎉</h3>
                                <p>Head to La Roche Cafe and collect your order with ID {order.orderNumber}.</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <h4 className="font-bold mb-2">Items</h4>
                            {order.items.map((i, idx) => (
                                <div key={idx} className="flex justify-between text-muted mb-1">
                                    <span>{i.quantity}x {i.name}</span>
                                    <span>₹{i.subtotal}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                                <span>Total</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/menu')}
                            >
                                Reorder Items
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
