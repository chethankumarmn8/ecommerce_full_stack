// utils/razorpay.js
export const loadRazorpayScript = (keyId) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};