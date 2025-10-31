export const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount));
  } catch (error) {
    return '₹0.00';
  }
};

export const formatDate = (dateString) => {
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  } catch (error) {
    return 'N/A';
  }
};

// Additional helper functions can be added below
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
};

export const getStatusBadge = (status) => {
  switch(status.toLowerCase()) {
    case 'pending': return 'warning';
    case 'completed': return 'success';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
};