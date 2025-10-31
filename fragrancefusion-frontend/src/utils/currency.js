// utils/currency.js
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

// Optional: Add additional currency helpers if needed
export const parseCurrency = (value) => {
    return Number(value.replace(/[^0-9.-]+/g, ""));
};