import React from 'react';
import { banks as americanBanks, canadianbanks } from '../data';

interface BankLogoProps {
  selectedBank: string;
  className?: string;
}

const BankLogo: React.FC<BankLogoProps> = ({ selectedBank, className }) => {
  // Merge both American & Canadian banks
  const allBanks = [...americanBanks, ...canadianbanks];

  const bank = allBanks.find((b) => b.name === selectedBank);
  if (!bank?.additionalLogo) return null;

  let wrapperStyle: React.CSSProperties | undefined;
  let imageStyle: React.CSSProperties | undefined;

  if (bank.name === 'Wells Fargo') {
    wrapperStyle = {
      backgroundColor: '#D61F28',
      width: '200px',
      margin: 'auto',
    };
  } else if (bank.name === 'PNC') {
    wrapperStyle = {
      backgroundColor: '#414E58',
      width: '200px',
      margin: 'auto',
    };
  } else if (bank.name === 'KeyBank') {
    wrapperStyle = {
      backgroundColor: '#ffffff',
      width: '200px',
      margin: 'auto',
    };
  } else if (bank.name === 'M&T Bank') {
    wrapperStyle = {
      backgroundColor: '#166434',
      width: '200px',
      margin: 'auto',
    };
  } else if (bank.name === 'Navy Federal Credit Union') {
    wrapperStyle = {
      backgroundColor: '',
      width: '200px',
      height: 'auto',
      margin: 'auto',
    };
    imageStyle = {
      width: '200px',
      height: 'auto',
    };
  }
  return (
    <div style={wrapperStyle}>
      <img
        style={imageStyle}
        src={bank.additionalLogo}
        alt={selectedBank}
        className={className ?? 'h-10 object-contain'}
      />
    </div>
  );
};

export default BankLogo;
