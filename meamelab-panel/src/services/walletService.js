// services/walletService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/wallet';

export const getWalletDetails = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}/details`, config);
    return response.data;
};

export const rechargeWallet = async (token, amount) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(`${API_URL}/recharge`, { amount }, config);
    return response.data;
};

export const redeemWallet = async (token, amount) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(`${API_URL}/redeem`, { amount }, config);
    return response.data;
};

export const getTransactions = async (token, page = 1, perPage = 10, filters = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page,
            perPage,
            ...filters,
        });

        const response = await axios.get(`${API_URL}/details-transactions?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Failed to fetch transactions.');
    }
};