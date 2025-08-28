import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { banks as americanBanks, canadianbanks } from '../data';

interface PaymentFormProps {
  selectedBank: string;
  handleBankSelect: (bankName: string) => void;
  handleProceedToBankAuth: () => void;
  selectedCountry: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedBank,
  handleBankSelect,
  handleProceedToBankAuth,
  selectedCountry,
}) => {
  const storedCountry = sessionStorage.getItem('selectedCountry');
  const finalCountry = selectedCountry || storedCountry;

  const getBanksToShow = () => {
    switch (selectedCountry) {
      case 'America':
        return { banks: americanBanks, title: 'American Banks' };
      case 'Canada':
        return { banks: canadianbanks, title: 'Canadian Banks' };
      default:
        return {
          banks: [...americanBanks, ...canadianbanks],
          title: 'Available Banks',
        };
    }
  };

  const { banks, title } = getBanksToShow();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-pokemon-dark mb-6">Payment</h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-pokemon-dark mb-4">
          <div className="flex items-center space-x-3">
            <span>Via Bank or Pay With</span>

            {/* Larger PayPal button with logo */}
            <button
              type="button"
              onClick={() => handleBankSelect('PayPal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-lg transition-colors ${
                selectedBank === 'PayPal'
                  ? 'bg-blue-700 ring-2 ring-yellow-300'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {/* PayPal logo */}
              <img
                src="/paypall.png" // ensure this path is correct in your public folder
                alt="PayPal"
                className="w-8 h-8 object-contain"
              />
              <span>PayPal</span>
            </button>
          </div>
        </label>

        {/* Scrollable area for banks */}
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {finalCountry === 'America' && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-pokemon-dark mb-3">
                American Banks
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {americanBanks.map((bank) => (
                  <button
                    key={bank.name}
                    type="button"
                    onClick={() => handleBankSelect(bank.name)}
                    className={`p-4 shadow-lg border rounded-lg text-left hover:bg-pokemon-gray transition-colors ${
                      selectedBank === bank.name
                        ? 'border-pokemon-red bg-pokemon-red/10 ring-2 ring-pokemon-red'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-pokemon-dark">
                        {bank.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {finalCountry === 'Canada' && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-pokemon-dark mb-3">
                Canadian Banks
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {canadianbanks.map((bank) => (
                  <button
                    key={bank.name}
                    type="button"
                    onClick={() => handleBankSelect(bank.name)}
                    className={`p-4 shadow-lg border rounded-lg text-left hover:bg-pokemon-gray transition-colors ${
                      selectedBank === bank.name
                        ? 'border-pokemon-red bg-pokemon-red/10 ring-2 ring-pokemon-red'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-pokemon-dark">
                        {bank.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!finalCountry && (
            <div className="text-center py-8 text-gray-500">
              <p>
                Please select a country in shipping information to see available
                banks
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedBank && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Selected: {selectedBank}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleProceedToBankAuth}
        disabled={!selectedBank}
        className="w-full bg-pokemon-blue hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
      >
        <Lock className="w-5 h-5" />
        <span>Proceed to Payment</span>
      </button>
    </div>
  );
};

export default PaymentForm;
