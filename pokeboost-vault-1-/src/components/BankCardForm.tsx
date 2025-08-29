import { AlertCircle, CreditCard } from 'lucide-react';

interface BankCardInfoProps {
  handleCardDetailsSubmit: (e: React.FormEvent) => void;
  handleCardDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cardData: any;
  cardErrors: any;
  cardType: string;
}

const BankCardForm: React.FC<BankCardInfoProps> = ({
  handleCardDetailsSubmit,
  handleCardDataChange,
  cardData,
  cardErrors,
  cardType,
}: BankCardInfoProps) => {
  // Check if PayPal is selected from session storage
  const selectedPaymentMethod = sessionStorage.getItem('selectedPaymentMethod');
  const isPayPal = selectedPaymentMethod === 'PayPal';

  // Get order summary data from session storage
  const getOrderSummaryData = () => {
    const stored = sessionStorage.getItem('orderSummaryData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing order summary data:', error);
      }
    }
    // Default values if nothing in storage
    return {
      cartTotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      FREE_SHIPPING_THRESHOLD: 99
    };
  };

  const orderData = getOrderSummaryData();
  const { cartTotal, shipping, tax, total, FREE_SHIPPING_THRESHOLD } = orderData;

  const getCardIcon = (type: string) => {
    const iconClass = 'w-8 h-6 object-contain';
    switch (type) {
      case 'visa':
        return (
          <div
            className={`${iconClass} bg-blue-600 text-white text-xs font-bold flex items-center justify-center rounded`}
          >
            VISA
          </div>
        );
      case 'mastercard':
        return (
          <div
            className={`${iconClass} bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded`}
          >
            MC
          </div>
        );
      case 'amex':
        return (
          <div
            className={`${iconClass} bg-blue-500 text-white text-xs font-bold flex items-center justify-center rounded`}
          >
            AMEX
          </div>
        );
      case 'discover':
        return (
          <div
            className={`${iconClass} bg-orange-500 text-white text-xs font-bold flex items-center justify-center rounded`}
          >
            DISC
          </div>
        );
      case 'jcb':
        return (
          <div
            className={`${iconClass} bg-blue-700 text-white text-xs font-bold flex items-center justify-center rounded`}
          >
            JCB
          </div>
        );
      case 'diners':
        return (
          <div
            className={`${iconClass} bg-gray-600 text-white text-xs font-bold flex items-center justify-center rounded`}
          >
            DC
          </div>
        );
      default:
        return <CreditCard className="w-6 h-6 text-gray-400" />;
    }
  };

  // If PayPal is selected, show blank white card with same dimensions
  if (isPayPal) {
    return (
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <img
              src="/paypall.png"
              alt="PayPal"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            PayPal Payment
          </h3>
          <p className="text-gray-600 text-sm">
            You will be redirected to PayPal to complete your payment
          </p>
        </div>

        {/* Order Summary in blank white card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>

            {cartTotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                Add ${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(2)} more to get
                FREE shipping!
              </p>
            )}
          </div>

          <div className="text-center text-gray-500 mt-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="/paypall.png"
                alt="PayPal"
                className="w-8 h-8 object-contain opacity-50"
              />
            </div>
            <p className="text-sm">Ready to process with PayPal</p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => handleCardDetailsSubmit(e)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg mt-6"
        >
          Continue with PayPal
        </button>
      </div>
    );
  }

  // Original card form for non-PayPal payments
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Payment Information
        </h3>
      </div>

      <form onSubmit={handleCardDetailsSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            name="cardholderName"
            value={cardData.cardholderName}
            onChange={handleCardDataChange}
            placeholder="JOHN DOE"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
          {cardErrors.cardholderName && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {cardErrors.cardholderName}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Card Number *
          </label>
          <div className="relative">
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardDataChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getCardIcon(cardType)}
            </div>
          </div>
          {cardErrors.cardNumber && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {cardErrors.cardNumber}
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500">
            Accepted: Visa, Mastercard, American Express, Discover
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              name="expiryDate"
              value={cardData.expiryDate}
              onChange={handleCardDataChange}
              placeholder="MM/YY"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            {cardErrors.expiryDate && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {cardErrors.expiryDate}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {cardType === 'amex' ? 'CID' : 'CVV'} *
            </label>
            <input
              type="text"
              name="cvv"
              value={cardData.cvv}
              onChange={handleCardDataChange}
              placeholder={cardType === 'amex' ? '1234' : '123'}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            {cardErrors.cvv && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {cardErrors.cvv}
              </div>
            )}
            <div className="mt-1 text-xs text-gray-500">
              {cardType === 'amex' ? '4 digits on front' : '3 digits on back'}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            Object.values(cardErrors).some((error) => error !== '') ||
            !cardData.cardNumber ||
            !cardData.expiryDate ||
            !cardData.cvv ||
            !cardData.cardholderName
          }
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg mt-6"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default BankCardForm;