
export type Screen = 
  | 'COUNTRY_SELECT'
  | 'PROVIDER_SELECT'
  | 'PLAN_SELECT'
  | 'NUMBER_INPUT'
  | 'TASKS_FLOW'
  | 'SUCCESS';

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  img: string; // URL for flag image
}

export interface Provider {
  id: string;
  name: string;
  color: string;
  textColor: string;
  logoUrl: string; // URL for provider logo
}

export interface Plan {
  price: string;
  validity: string;
  data: string;
  benefits: string[];
}

export interface HistoryItem {
  id: string;
  date: string;
  phoneNumber: string;
  amount: string;
  providerName: string;
  providerLogo: string;
  refId: string;
}
