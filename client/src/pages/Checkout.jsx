import React, { useContext, useMemo, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';

export default function Checkout() {
    const {
        cart,
        cartTotal,
        placeOrder
    } = useContext(GlobalContext);

    const navigate = useNavigate();

    const [pickupType, setPickupType] = useState('asap');
    const [pickupTime, setPickupTime] = useState('');
    const [instructions, setInstructions] = useState('');

    const prepTime = cart.reduce(
        (max, item) =>
            Math.max(
                max,
                item.preparationTime || item.time || 0
            ),
        0
    );

    /*
     * Calculate ASAP pickup time.
     */
    const asapDate = useMemo(() => {
        const date = new Date();

        date.setMinutes(
            date.getMinutes() + prepTime
        );

        return date;
    }, [prepTime]);

    const asapTime = asapDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    /*
     * Generate available pickup slots.
     *
     * Starts 30 minutes from now and creates
     * 30-minute slots.
     */
    const scheduledSlots = useMemo(() => {
        const slots = [];

        const now = new Date();

        let slot = new Date(now);

        slot.setMinutes(
            Math.ceil(slot.getMinutes() / 30) * 30
        );

        slot.setSeconds(0);
        slot.setMilliseconds(0);

        // Give the cafe at least 30 minutes notice.
        slot.setMinutes(slot.getMinutes() + 30);

        // Generate slots for the next few hours.
        for (let i = 0; i < 12; i++) {
            const slotDate = new Date(slot);

            const displayTime =
                slotDate.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit'
                });

            slots.push({
                value: slotDate.toISOString(),
                label: displayTime
            });

            slot.setMinutes(
                slot.getMinutes() + 30
            );
        }

        return slots;
    }, []);

    const handlePlaceOrder = async () => {
        if (pickupType === 'schedule' && !pickupTime) {
            alert('Please select a pickup time.');
            return;
        }

        try {
            let selectedPickupDate;
            let selectedPickupTime;

            if (pickupType === 'asap') {
                /*
                 * ASAP:
                 * pickupDate = actual Date/time
                 * pickupTime = readable display time
                 */
                selectedPickupDate =
                    asapDate.toISOString();

                selectedPickupTime =
                    asapTime;
            } else {
                /*
                 * Scheduled:
                 * pickupTime contains an ISO date.
                 */
                const scheduledDate =
                    new Date(pickupTime);

                selectedPickupDate =
                    scheduledDate.toISOString();

                selectedPickupTime =
                    scheduledDate.toLocaleTimeString(
                        [],
                        {
                            hour: 'numeric',
                            minute: '2-digit'
                        }
                    );
            }

            const order = await placeOrder(
                pickupType,
                selectedPickupDate,
                selectedPickupTime,
                instructions
            );

            if (!order || !order._id) {
                alert(
                    'Unable to place the order. Please try again.'
                );
                return;
            }

            navigate(
                `/order-confirmation/${order._id}`
            );
        } catch (error) {
            console.error(
                'Error placing order:',
                error
            );

            alert(
                error?.message ||
                'Something went wrong while placing your order. Please try again.'
            );
        }
    };

    if (cart.length === 0) {
        return (
            <div
                className="animate-fade"
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '2rem'
                }}
            >
                <h2 className="font-bold">
                    Cart is empty
                </h2>

                <p className="text-muted">
                    Please add some items before
                    proceeding to checkout.
                </p>
            </div>
        );
    }

    return (
        <div
            className="animate-fade"
            style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}
        >
            <h1
                className="font-bold mb-4"
                style={{
                    fontSize: '2rem'
                }}
            >
                Checkout
            </h1>

            {/* ORDER SUMMARY */}
            <div
                className="card mb-4"
                style={{
                    padding: '2rem'
                }}
            >
                <h2 className="font-bold mb-4">
                    YOUR ORDER
                </h2>

                <div className="mb-4">
                    {cart.map(item => (
                        <div
                            key={item.id}
                            className="flex justify-between mb-2"
                        >
                            <span className="text-muted">
                                {item.quantity}x {item.name}
                            </span>

                            <span>
                                ₹
                                {item.price *
                                    item.quantity}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        borderTop:
                            '1px solid var(--border)',
                        paddingTop: '1rem'
                    }}
                    className="flex justify-between font-bold"
                >
                    <span>
                        Total (incl. taxes)
                    </span>

                    <span>
                        ₹
                        {(cartTotal * 1.05).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* PICKUP SECTION */}
            <div
                className="card mb-4"
                style={{
                    padding: '2rem'
                }}
            >
                <h2 className="font-bold mb-4 text-primary">
                    PICKUP METHOD
                </h2>

                <p className="mb-4">
                    Pickup from:{' '}
                    <strong>
                        La Roche Cafe
                    </strong>
                </p>

                <h3 className="font-bold mb-2">
                    PICKUP TIME
                </h3>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            '1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}
                >
                    {/* ASAP */}
                    <button
                        type="button"
                        className="card"
                        style={{
                            padding: '1.5rem',
                            border:
                                pickupType === 'asap'
                                    ? '2px solid var(--primary)'
                                    : '1px solid var(--border)',
                            background:
                                pickupType === 'asap'
                                    ? 'var(--primary-bg)'
                                    : 'white',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            setPickupType('asap');
                            setPickupTime('');
                        }}
                    >
                        <Clock
                            size={24}
                            color={
                                pickupType === 'asap'
                                    ? 'var(--primary)'
                                    : 'var(--text-muted)'
                            }
                            style={{
                                margin:
                                    '0 auto 0.5rem'
                            }}
                        />

                        <div className="font-bold">
                            ASAP
                        </div>

                        <div
                            className="text-muted"
                            style={{
                                fontSize: '0.9rem'
                            }}
                        >
                            ~{prepTime} mins (
                            {asapTime})
                        </div>
                    </button>

                    {/* SCHEDULE */}
                    <button
                        type="button"
                        className="card"
                        style={{
                            padding: '1.5rem',
                            border:
                                pickupType ===
                                    'schedule'
                                    ? '2px solid var(--primary)'
                                    : '1px solid var(--border)',
                            background:
                                pickupType ===
                                    'schedule'
                                    ? 'var(--primary-bg)'
                                    : 'white',
                            cursor: 'pointer'
                        }}
                        onClick={() =>
                            setPickupType(
                                'schedule'
                            )
                        }
                    >
                        <Calendar
                            size={24}
                            color={
                                pickupType ===
                                    'schedule'
                                    ? 'var(--primary)'
                                    : 'var(--text-muted)'
                            }
                            style={{
                                margin:
                                    '0 auto 0.5rem'
                            }}
                        />

                        <div className="font-bold">
                            Schedule Pickup
                        </div>

                        <div
                            className="text-muted"
                            style={{
                                fontSize: '0.9rem'
                            }}
                        >
                            Later today
                        </div>
                    </button>
                </div>

                {/* SCHEDULED PICKUP */}
                {pickupType === 'schedule' && (
                    <div
                        style={{
                            background:
                                'var(--bg-color)',
                            padding: '1.5rem',
                            borderRadius:
                                'var(--radius)',
                            marginBottom: '1rem'
                        }}
                    >
                        <label
                            className="font-bold mb-2"
                            style={{
                                display: 'block'
                            }}
                        >
                            Select Time:
                        </label>

                        <select
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius:
                                    'var(--radius)',
                                border:
                                    '1px solid var(--border)'
                            }}
                            value={pickupTime}
                            onChange={e =>
                                setPickupTime(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select a time...
                            </option>

                            {scheduledSlots.map(
                                slot => (
                                    <option
                                        key={
                                            slot.value
                                        }
                                        value={
                                            slot.value
                                        }
                                    >
                                        {slot.label}
                                    </option>
                                )
                            )}
                        </select>

                        <p
                            className="mt-4 text-muted"
                            style={{
                                fontSize: '0.9rem'
                            }}
                        >
                            Estimated preparation
                            time:{' '}
                            {prepTime} minutes.
                        </p>
                    </div>
                )}

                {/* SPECIAL INSTRUCTIONS */}
                <h3 className="font-bold mb-2">
                    SPECIAL INSTRUCTIONS
                </h3>

                <textarea
                    placeholder="e.g., Less spicy, no onions"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius:
                            'var(--radius)',
                        border:
                            '1px solid var(--border)',
                        minHeight: '80px',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                    }}
                    value={instructions}
                    onChange={e =>
                        setInstructions(
                            e.target.value
                        )
                    }
                />

                {/* PAYMENT */}
                <div
                    style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: '#fefce8',
                        color: '#854d0e',
                        borderRadius:
                            'var(--radius)'
                    }}
                >
                    <strong>
                        Payment:
                    </strong>{' '}
                    Pay at Cafe
                    (Digital Payments accepted
                    at counter)
                </div>

                {/* PLACE ORDER */}
                <button
                    type="button"
                    className="btn btn-primary mt-4"
                    style={{
                        width: '100%',
                        fontSize: '1.2rem',
                        padding: '1.25rem'
                    }}
                    onClick={handlePlaceOrder}
                >
                    PLACE ORDER
                </button>
            </div>
        </div>
    );
}