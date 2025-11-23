import { Country, Plan, Provider } from './types';

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', dialCode: '+91', img: 'https://flagcdn.com/w160/in.png' },
  { code: 'US', name: 'United States', dialCode: '+1', img: 'https://flagcdn.com/w160/us.png' },
  { code: 'UK', name: 'United Kingdom', dialCode: '+44', img: 'https://flagcdn.com/w160/gb.png' },
  { code: 'CA', name: 'Canada', dialCode: '+1', img: 'https://flagcdn.com/w160/ca.png' },
  { code: 'AU', name: 'Australia', dialCode: '+61', img: 'https://flagcdn.com/w160/au.png' },
  { code: 'DE', name: 'Germany', dialCode: '+49', img: 'https://flagcdn.com/w160/de.png' },
  { code: 'FR', name: 'France', dialCode: '+33', img: 'https://flagcdn.com/w160/fr.png' },
  { code: 'JP', name: 'Japan', dialCode: '+81', img: 'https://flagcdn.com/w160/jp.png' },
];

export const PROVIDERS: Provider[] = [
  { 
    id: 'jio', 
    name: 'Jio', 
    color: 'bg-blue-700', 
    textColor: 'text-white', 
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Reliance_Jio_Logo_%28October_2015%29.svg/1024px-Reliance_Jio_Logo_%28October_2015%29.svg.png' 
  },
  { 
    id: 'airtel', 
    name: 'Airtel', 
    color: 'bg-red-600', 
    textColor: 'text-white', 
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Airtel_Logo.svg/1024px-Airtel_Logo.svg.png' 
  },
  { 
    id: 'vi', 
    name: 'Vi', 
    color: 'bg-yellow-400', 
    textColor: 'text-white', 
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Vi_cellular_logo.svg/1024px-Vi_cellular_logo.svg.png' 
  },
  { 
    id: 'bsnl', 
    name: 'BSNL', 
    color: 'bg-green-600', 
    textColor: 'text-white', 
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/BSNL_2000.svg/1024px-BSNL_2000.svg.png' 
  },
];

export const PLANS: Plan[] = [
  { price: '₹489', validity: '11 months', data: '2 GB/28 days', benefits: ['YouTube', 'Cloud'] },
  { price: '₹152', validity: '28 days', data: '0.5 GB/day', benefits: ['YouTube', 'Cloud'] },
  { price: '₹186', validity: '28 days', data: '1 GB/day', benefits: ['YouTube', 'Cloud'] },
  { price: '₹223', validity: '28 days', data: '2 GB/day', benefits: ['YouTube', 'Cloud'] },
  { price: '₹399', validity: '28 days', data: '2 GB/day', benefits: ['YouTube', 'Cloud'] },
];

export const QUESTIONS = [
  {
    id: 1,
    text: "क्या आप अपना Mobile नंबर फ्री में Recharge करना चाहते हैं?",
    options: ["हाँ", "नहीं"]
  },
  {
    id: 2,
    text: "क्या आप Color Prediction गेम के बारे में जानते हैं?",
    options: ["हाँ", "नहीं"]
  },
  {
    id: 3,
    text: "क्या आप गेम खेलकर पैसे कमाना चाहते हैं?",
    options: ["हाँ", "नहीं"]
  }
];