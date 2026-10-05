import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function OrderConfirmation() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError('');

                console.log('Fetching order:', id);

                const data = await orderService.getOrderById(id);

                console.log('Order received:', data);

                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);

                setError(
                    err?.message ||
                    'Unable to load your order.'
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        } else {
            setLoading(false);
            setError('Order ID is missing.');
        }
    }, [id]);

    if (loading) {
        return (
            <div
                className="text-center"
                style={{
                    padding: '4rem 1rem'
                }}
            >
                <h2 className="font-bold">
                    Loading order...
                </h2>

                <p className="text-muted">
                    Please wait while we fetch your order.
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="animate-fade"
                style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    padding: '3rem 1rem',
                    textAlign: 'center'
                }}
            >
                <AlertCircle
                    size={64}
                    color="var(--danger)"
                    style={{
                        margin: '0 auto 1rem'
                    }}
                />

                <h2 className="font-bold">
                    Unable to load order
                </h2>

                <p
                    className="text-muted"
                    style={{
                        marginTop: '1rem'
                    }}
                >
                    {error}
                </p>

                <Link
                    to="/orders"
                    className="btn btn-primary"
                    style={{
                        display: 'inline-block',
                        marginTop: '1.5rem'
                    }}
                >
                    Go to My Orders
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div
                className="text-center"
                style={{
                    padding: '4rem 1rem'
                }}
            >
                <h2 className="font-bold">
                    Order not found
                </h2>

                <Link
                    to="/orders"
                    className="btn btn-primary"
                    style={{
                        display: 'inline-block',
                        marginTop: '1.5rem'
                    }}
                >
                    View My Orders
                </Link>
            </div>
        );
    }

    return (
        <div
            className="animate-fade flex justify-center"
            style={{
                padding: '2rem 1rem'
            }}
        >
            <div
                className="card text-center"
                style={{
                    padding: '3rem',
                    maxWidth: '500px',
                    width: '100%'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }}
                >
                    <CheckCircle
                        size={64}
                        color="var(--success)"
                    />
                </div>

                <h1
                    className="font-bold mb-2"
                    style={{
                        fontSize: '2rem',
                        color: 'var(--success)'
                    }}
                >
                    ORDER CONFIRMED!
                </h1>

                <p className="text-muted mb-4">
                    Your order has been sent to
                    La Roche Cafe.
                </p>

                <div
                    style={{
                        background: 'var(--bg-color)',
                        padding: '2rem',
                        borderRadius: 'var(--radius)',
                        margin: '2rem 0'
                    }}
                >
                    <p className="text-muted mb-2">
                        ORDER NUMBER
                    </p>

                    <div
                        className="font-bold"
                        style={{
                            fontSize: '3rem',
                            letterSpacing: '2px',
                            color: 'var(--primary)'
                        }}
                    >
                        {order.orderNumber}
                    </div>

                    <p className="mt-4">
                        <strong>
                            Pickup Time:
                        </strong>{' '}

                        {order.pickupType === 'ASAP'
                            ? 'ASAP'
                            : order.pickupTime}
                    </p>

                    <p className="mt-2">
                        <strong>
                            Status:
                        </strong>{' '}
                        {order.orderStatus}
                    </p>

                    <p className="mt-2">
                        <strong>
                            Payment:
                        </strong>{' '}
                        Pay at Cafe
                    </p>
                </div>

                <p
                    className="mb-4"
                    style={{
                        fontSize: '1.1rem'
                    }}
                >
                    When ready, come to
                    La Roche Cafe and collect
                    your order.

                    <br />
                    <br />

                    <strong
                        style={{
                            color: 'var(--danger)'
                        }}
                    >
                        Please show your order
                        number at pickup.
                    </strong>
                </p>

                <Link
                    to="/orders"
                    className="btn btn-primary"
                    style={{
                        width: '100%'
                    }}
                >
                    TRACK ORDER
                </Link>
            </div>
        </div>
    );
}