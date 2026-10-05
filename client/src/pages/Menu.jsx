import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Clock, Plus } from 'lucide-react';

export default function Menu() {
    const { addToCart, foods, loading } = useContext(GlobalContext);
    const [filter, setFilter] = useState('All');

    if (loading) return <div className="text-center mt-4">Loading menu...</div>;

    const categoriesSet = new Set(foods.map(f => f.category?.name || 'Uncategorized'));
    const categories = ['All', ...Array.from(categoriesSet)];

    const filtered = filter === 'All' ? foods : foods.filter(m => (m.category?.name || 'Uncategorized') === filter);

    return (
        <div className="animate-fade">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>LA ROCHE CAFE</h1>
                <p className="text-muted" style={{ fontSize: '1.2rem' }}>Today's Menu</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {categories.map(c => (
                    <button
                        key={c}
                        onClick={() => setFilter(c)}
                        style={{
                            padding: '0.5rem 1.25rem', borderRadius: '2rem', fontWeight: '600',
                            border: '1px solid var(--primary)',
                            background: filter === c ? 'var(--primary)' : 'white',
                            color: filter === c ? 'white' : 'var(--primary)'
                        }}
                    >{c}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filtered.map(food => (
                    <div key={food._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{food.name}</h3>
                            <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>₹{food.price}</span>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem', flexGrow: 1 }}>{food.description}</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <Clock size={16} /> {food.preparationTime} min preparation
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            {food.available ? (
                                <button
                                    className="btn"
                                    style={{ width: '100%', background: 'var(--primary-bg)', color: 'var(--primary)', border: '1px solid var(--primary-light)' }}
                                    onClick={() => addToCart(food)}
                                >
                                    <Plus size={18} /> Add to Cart
                                </button>
                            ) : (
                                <button className="btn" style={{ width: '100%', background: 'var(--border)', color: 'var(--text-muted)', cursor: 'not-allowed' }} disabled>
                                    CURRENTLY UNAVAILABLE
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
