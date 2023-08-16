export const googleAnalyticsService = {
  shootEvent,
  shootSearchEvent,
  shootPurchaseEvent
}

function shootSearchEvent() {
  return shootEvent('site_search');
}

function shootPurchaseEvent(purchase) {
  shootEvent(undefined,  {ecommerce: null});  // Clear the previous ecommerce object.
  shootEvent("purchase", {ecommerce: {
    transaction_id: purchase.recurringId, //required field, ID of real transaction based on your DB
    value: purchase.price, //total value 
    currency: _coinToCurency(purchase.coin), //currency of payment 
    coupon: purchase.coupon || undefined, //if exist, if not - delete field or leave blank
    items: [{
      item_id: purchase.plan, //or id=2 if annual plan
      item_name: purchase.plan, //or Annual Plan
      price: purchase.price, //price in paid currency
      quantity: 1
    }]
  }});
}

function shootEvent(event, data = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data
  });
}


function _coinToCurency(coinnSign) {
  switch (coinnSign) {
    case '₪':
      return 'ILS'
    case '€':
      return 'EUR'
    case '$':
    default:
      return 'USD'
  }
}