import React, {
    createContext,
    useState,
    useEffect
} from 'react';

import {
    authService,
    foodService,
    orderService
} from '../services/api';


export const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (token) {

            authService.getMe()
                .then(data => {
                    setUser(data);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                });
        }


        foodService.getFoods()
            .then(data => {
                setFoods(data);
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false);
            });

    }, []);


    // =========================
    // LOGIN
    // =========================

    const login = async (email, password) => {

        const data = await authService.login(
            email,
            password
        );

        localStorage.setItem(
            'token',
            data.token
        );

        setUser(data);

        return data;
    };


    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem('token');

        setUser(null);
    };


    // =========================
    // CART
    // =========================

    const addToCart = (item) => {

        setCart(prev => {

            const existing = prev.find(
                i => i.id === item.id
            );

            if (existing) {

                return prev.map(i =>
                    i.id === item.id
                        ? {
                            ...i,
                            quantity: i.quantity + 1
                        }
                        : i
                );
            }

            return [
                ...prev,
                {
                    ...item,
                    id: item._id,
                    quantity: 1
                }
            ];
        });
    };


    const updateQuantity = (id, delta) => {

        setCart(prev =>
            prev.map(item => {

                if (item.id === id) {

                    const newQ =
                        item.quantity + delta;

                    return newQ > 0
                        ? {
                            ...item,
                            quantity: newQ
                        }
                        : item;
                }

                return item;
            })
        );
    };


    const removeFromCart = (id) => {

        setCart(prev =>
            prev.filter(i => i.id !== id)
        );
    };


    const clearCart = () => {
        setCart([]);
    };


    const cartTotal = cart.reduce(
        (acc, item) =>
            acc + (
                item.price *
                item.quantity
            ),
        0
    );


    // =========================
    // PLACE ORDER
    // =========================

    const placeOrder = async (
        pickupType,
        pickupTime,
        instructions
    ) => {

        /*
         * Frontend values:
         * asap     -> ASAP
         * schedule -> SCHEDULED
         */

        const backendPickupType =
            pickupType === 'asap'
                ? 'ASAP'
                : 'SCHEDULED';


        /*
         * Create today's date for pickupDate.
         * MongoDB expects a Date, NOT "10:45 AM".
         */

        const pickupDate = new Date();


        const items = cart.map(item => ({
            foodId: item._id,
            quantity: item.quantity
        }));


        const orderData = {

            items,

            pickupType:
                backendPickupType,

            pickupDate,

            pickupTime,

            specialInstructions:
                instructions || ''
        };


        console.log(
            'Sending order:',
            orderData
        );


        const newOrder =
            await orderService.createOrder(
                orderData
            );


        setOrders(prev => [
            newOrder,
            ...prev
        ]);


        clearCart();


        return newOrder;
    };


    return (

        <GlobalContext.Provider
            value={{

                user,
                login,
                logout,

                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartTotal,

                orders,
                placeOrder,
                setOrders,

                foods,
                loading

            }}
        >

            {children}

        </GlobalContext.Provider>
    );
};