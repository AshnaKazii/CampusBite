import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useContext(GlobalContext);
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="animate-fade text-center" style={{ padding: '4rem 0' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
                <p className="text-muted mb-4">Add some items from La Roche Cafe menu.</p>
                <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade">
            <h1 className="font-bold mb-4" style={{ fontSize: '2rem' }}>Review Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map(item => (
                        <div key={item.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 className="font-bold" style={{ fontSize: '1.2rem' }}>{item.name}</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>₹{item.price} each &bull; {item.time} min prep</p>
                                <div className="font-bold" style={{ marginTop: '0.5rem', color: 'var(--primary)' }}>₹{item.price * item.quantity}</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
                                    <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.5rem' }}><Minus size={16} /></button>
                                    <span style={{ minWidth: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.5rem' }}><Plus size={16} /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--danger)', padding: '0.5rem' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h2 className="font-bold mb-4" style={{ fontSize: '1.25rem' }}>Order Summary</h2>
                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span>Taxes (5%)</span>
                        <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                    </div>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
                    <div className="flex justify-between font-bold" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
                        <span>Total</span>
                        <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
                        PROCEED TO PICKUP
                    </button>
                </div>
            </div>
        </div>
    );
}
