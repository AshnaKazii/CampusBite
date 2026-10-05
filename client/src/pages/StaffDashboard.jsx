import React, { useEffect, useState } from 'react';
import { orderService, adminService, foodService, categoryService } from '../services/api';

export default function StaffDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orderFilter, setOrderFilter] = useState('ALL');

    const [editingFood, setEditingFood] = useState(null);
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

    const fetchData = () => {
        orderService.getAllOrders().then(setOrders).catch(console.error);
        adminService.getStats().then(setStats).catch(console.error);
    };

    const fetchMenuData = () => {
        foodService.getFoods().then(setFoods).catch(console.error);
        categoryService.getCategories().then(setCategories).catch(console.error);
    };

    useEffect(() => {
        fetchData();
        fetchMenuData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await orderService.updateOrderStatus(id, newStatus);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSaveFood = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Ensure price & prep time are numbers
        const p = parseFloat(formData.get('price'));
        const prep = parseInt(formData.get('preparationTime'), 10);

        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: isNaN(p) ? 0 : p,
            preparationTime: isNaN(prep) ? 0 : prep,
            category: formData.get('category'),
            available: formData.get('available') === 'true',
            isVegetarian: formData.get('isVegetarian') === 'true'
        };

        try {
            if (editingFood) {
                await foodService.updateFood(editingFood._id, data);
            } else {
                await foodService.createFood(data);
            }
            setIsFoodModalOpen(false);
            fetchMenuData(); // refresh
            fetchData(); // refresh stats
        } catch (error) {
            alert(error.message || 'Error saving food');
        }
    };

    const handleToggleAvailable = async (food) => {
        try {
            await foodService.updateFood(food._id, { available: !food.available });
            fetchMenuData();
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteFood = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this food item?')) {
            try {
                await foodService.deleteFood(id);
                fetchMenuData();
                fetchData();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return (
        <div className="animate-fade">
            <h1 className="font-bold mb-4" style={{ fontSize: '2.5rem' }}>Staff Dashboard</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '1rem' }}>
                <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>DASHBOARD</TabButton>
                <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>ORDER MANAGEMENT</TabButton>
                <TabButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')}>MENU MANAGEMENT</TabButton>
            </div>

            {activeTab === 'dashboard' && (
                <div>
                    <h2 className="font-bold mb-4" style={{ fontSize: '1.5rem' }}>Today's Analytics</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <StatCard title="Today's Sales" value={`₹${stats?.revenueToday || 0}`} color="var(--success)" />
                        <StatCard title="Today's Orders" value={stats?.ordersToday || 0} />
                        <StatCard title="Completed" value={stats?.completed || 0} />
                        <StatCard title="Cancelled" value={stats?.cancelled || 0} color="var(--danger)" />
                        <StatCard title="Pending" value={stats?.pending || 0} color="var(--primary)" />
                        <StatCard title="Preparing" value={stats?.preparing || 0} color="var(--warning)" />
                        <StatCard title="Ready" value={stats?.ready || 0} color="var(--success)" />
                        <StatCard title="Total Menu Items" value={stats?.totalMenuItems || 0} />
                        <StatCard title="Available Items" value={stats?.availableMenuItems || 0} color="var(--success)" />
                        <StatCard title="Unavailable Items" value={stats?.outOfStockItems || 0} color="var(--text-muted)" />
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {['ALL', 'PENDING', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED'].map(f => (
                            <button
                                key={f}
                                onClick={() => setOrderFilter(f)}
                                style={{
                                    padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--border)',
                                    background: orderFilter === f ? 'var(--primary)' : 'var(--bg-color)',
                                    color: orderFilter === f ? 'white' : 'var(--text-main)',
                                    fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders
                            .filter(o => {
                                if (orderFilter === 'ALL') return true;
                                if (orderFilter === 'PENDING') return o.orderStatus === 'PLACED' || o.orderStatus === 'ACCEPTED';
                                return o.orderStatus === orderFilter;
                            })
                            .map(o => (
                                <OrderAdminCard key={o._id} order={o} onUpdate={updateStatus} />
                            ))}
                        {orders.length === 0 && <p>No orders matched your criteria.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'menu' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="font-bold" style={{ fontSize: '1.5rem' }}>Menu Items</h2>
                        <button className="btn btn-primary" onClick={() => { setEditingFood(null); setIsFoodModalOpen(true); }}>+ Add Food Item</button>
                    </div>

                    <div style={{ overflowX: 'auto', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)' }}>
                                    <th style={{ padding: '1rem' }}>Food Name</th>
                                    <th style={{ padding: '1rem' }}>Category</th>
                                    <th style={{ padding: '1rem' }}>Price</th>
                                    <th style={{ padding: '1rem' }}>Prep Time</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foods.map(f => (
                                    <tr key={f._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{f.name}</td>
                                        <td style={{ padding: '1rem' }}>{f.category?.name || 'Uncategorized'}</td>
                                        <td style={{ padding: '1rem' }}>₹{f.price}</td>
                                        <td style={{ padding: '1rem' }}>{f.preparationTime} min</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 'bold',
                                                background: f.available ? '#dcfce7' : '#fee2e2',
                                                color: f.available ? '#16a34a' : '#dc2626'
                                            }}>
                                                {f.available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { setEditingFood(f); setIsFoodModalOpen(true); }}>Edit</button>
                                            <button className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', background: 'var(--bg-color)', border: '1px solid var(--border)', fontWeight: 'bold' }} onClick={() => handleToggleAvailable(f)}>
                                                {f.available ? 'Disable' : 'Enable'}
                                            </button>
                                            <button className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', background: '#fee2e2', color: '#dc2626', border: 'none', fontWeight: 'bold' }} onClick={() => handleDeleteFood(f._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {foods.length === 0 && <div style={{ padding: '2rem', textAlign: 'center' }}>No menu items found.</div>}
                    </div>

                    {isFoodModalOpen && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                        }}>
                            <div className="card animate-fade" style={{ background: 'white', padding: '2rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                                <h3 className="font-bold mb-4 text-xl">{editingFood ? 'Edit Food Item' : 'Add Food Item'}</h3>
                                <form onSubmit={handleSaveFood} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label className="font-bold text-sm mb-1" style={{ display: 'block' }}>Name</label>
                                        <input required name="name" defaultValue={editingFood?.name || ''} style={modalInputStyle} placeholder="E.g. Veg Burger" />
                                    </div>
                                    <div>
                                        <label className="font-bold text-sm mb-1" style={{ display: 'block' }}>Description</label>
                                        <textarea required name="description" defaultValue={editingFood?.description || ''} style={{ ...modalInputStyle, resize: 'vertical' }} rows="3" />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label className="font-bold text-sm mb-1" style={{ display: 'block' }}>Price (₹)</label>
                                            <input required name="price" type="number" min="0" step="1" defaultValue={editingFood?.price || ''} style={modalInputStyle} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="font-bold text-sm mb-1" style={{ display: 'block' }}>Prep Time (mins)</label>
                                            <input required name="preparationTime" type="number" min="1" step="1" defaultValue={editingFood?.preparationTime || ''} style={modalInputStyle} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="font-bold text-sm mb-1" style={{ display: 'block' }}>Category</label>
                                        <select required name="category" defaultValue={editingFood?.category?._id || ''} style={modalInputStyle}>
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c._id} value={c._id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input type="checkbox" name="available" value="true" defaultChecked={editingFood ? editingFood.available : true} />
                                            Available
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input type="checkbox" name="isVegetarian" value="true" defaultChecked={editingFood ? editingFood.isVegetarian : true} />
                                            Vegetarian
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" className="btn btn-secondary" onClick={() => setIsFoodModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const modalInputStyle = {
    width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '1rem'
};

function TabButton({ children, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '3px solid var(--primary)' : '3px solid transparent',
                color: active ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 'bold',
                padding: '0.5rem 1rem',
                fontSize: '1.1rem',
                transition: 'all 0.2s',
                cursor: 'pointer'
            }}
        >
            {children}
        </button>
    );
}

function StatCard({ title, value, color = 'var(--text-main)' }) {
    return (
        <div className="card" style={{ padding: '1.5rem', borderBottom: `4px solid ${color !== 'var(--text-main)' ? color : 'var(--border)'}` }}>
            <div className="text-muted mb-2" style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '0.9rem' }}>{title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color }}>{value}</div>
        </div>
    );
}

function OrderAdminCard({ order, onUpdate }) {
    // Determine possible actions based on current status
    const statusFlow = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COLLECTED'];
    let nextAction = null;
    let nextText = null;
    let nextColor = null;

    if (order.orderStatus === 'PLACED') { nextAction = 'ACCEPTED'; nextText = 'ACCEPT ORDER'; nextColor = 'var(--primary)'; }
    if (order.orderStatus === 'ACCEPTED') { nextAction = 'PREPARING'; nextText = 'START PREPARING'; nextColor = 'var(--warning)'; }
    if (order.orderStatus === 'PREPARING') { nextAction = 'READY'; nextText = 'MARK READY'; nextColor = 'var(--success)'; }
    if (order.orderStatus === 'READY') { nextAction = 'COLLECTED'; nextText = 'MARK COLLECTED'; nextColor = '#1f2937'; }

    return (
        <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between items-start mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                    <div className="font-bold text-xl text-primary">{order.orderNumber}</div>
                    <div className="text-muted text-sm mt-1">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-muted text-sm mt-1">Student: {order.userId?.name || 'Unknown'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Status: {order.orderStatus}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        {order.pickupType === 'ASAP' ? 'ASAP' : `Scheduled: ${order.pickupTime}`}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                {order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-sm mb-1 text-muted">
                        <span>{i.quantity}x {i.name}</span>
                        <span>₹{i.subtotal}</span>
                    </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t text-lg" style={{ borderTop: '1px solid var(--border)' }}>
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                </div>
            </div>

            {order.specialInstructions && (
                <div style={{ background: 'var(--primary-bg)', color: 'var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <strong>Note:</strong> {order.specialInstructions}
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'COLLECTED' && (
                    <button
                        onClick={() => onUpdate(order._id, 'CANCELLED')}
                        style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: 'var(--radius)', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        CANCEL ORDER
                    </button>
                )}

                {nextAction && (
                    <button
                        onClick={() => onUpdate(order._id, nextAction)}
                        className="btn"
                        style={{ background: nextColor, color: 'white' }}
                    >
                        {nextText}
                    </button>
                )}
            </div>
        </div>
    );
}
