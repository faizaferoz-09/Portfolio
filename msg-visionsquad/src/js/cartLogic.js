/**
 * Shopping Cart calculation logic for FandomVerse
 */

export const AVAILABLE_COUPONS = {
  FANDOM10: { code: 'FANDOM10', discountPercent: 10, label: '10% Fan Welcome Discount' },
  CYBER20: { code: 'CYBER20', discountPercent: 20, label: '20% Cyberpunk Super Sale' },
  ANIMEEXPO: { code: 'ANIMEEXPO', discountPercent: 15, label: '15% Convention Special' },
  FREEPOST: { code: 'FREEPOST', fixedDiscount: 5.0, label: '$5 Free Warp Shipping Credit' }
};

export function calculateSubtotal(cartItems) {
  if (!Array.isArray(cartItems)) return 0;
  return cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + (price * qty);
  }, 0);
}

export function calculateTax(subtotal, taxRate = 0.08) {
  return Number((subtotal * taxRate).toFixed(2));
}

export function calculateDiscount(subtotal, couponCode) {
  if (!couponCode) return { discountAmount: 0, appliedCoupon: null };
  const upper = couponCode.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[upper];
  if (!coupon) return { discountAmount: 0, appliedCoupon: null, error: 'Invalid coupon code' };

  let discountAmount = 0;
  if (coupon.discountPercent) {
    discountAmount = (subtotal * coupon.discountPercent) / 100;
  } else if (coupon.fixedDiscount) {
    discountAmount = Math.min(subtotal, coupon.fixedDiscount);
  }

  return {
    discountAmount: Number(discountAmount.toFixed(2)),
    appliedCoupon: coupon,
    error: null
  };
}

export function calculateCartSummary(cartItems, couponCode = '', shippingMethod = 'standard') {
  const subtotal = calculateSubtotal(cartItems);
  const totalItemCount = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const { discountAmount, appliedCoupon, error: couponError } = calculateDiscount(subtotal, couponCode);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  const shippingFee = subtotal === 0 ? 0 : (shippingMethod === 'express' ? 14.99 : (subtotal > 75 ? 0 : 5.99));
  const tax = calculateTax(discountedSubtotal);
  const finalTotal = Number((discountedSubtotal + shippingFee + tax).toFixed(2));

  return {
    itemCount: totalItemCount,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount,
    appliedCoupon,
    couponError,
    shippingFee,
    tax,
    finalTotal
  };
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
}
