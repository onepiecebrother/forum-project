export const AGENTS_PER_PAGE = 9;
export const FORM_STORAGE_KEY = 'agent_registration_form_data';
export const MAX_AGENT_PROFILES = 5;
export const MAX_IMAGES_PER_DEAL = 5;
export const MAX_IMAGES_PER_VERIFICATION = 3;

export const CURRENCIES = [
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' }
] as const;

export const DEAL_TYPES = [
  { value: 'hire_agent', label: 'Hire Agent', description: 'Hiring an agent for services' },
  { value: 'transaction', label: 'Transaction', description: 'Business transaction or trade' },
  { value: 'other', label: 'Other', description: 'Other type of deal or agreement' }
] as const;

export const DEAL_STATUSES = [
  'pending',
  'negotiating', 
  'approved',
  'rejected',
  'cancelled'
] as const;

export const REQUEST_STATUSES = [
  'pending',
  'approved',
  'rejected'
] as const;

export const RESPONSE_TYPES = [
  'recipient_response',
  'admin_approval'
] as const;

export const DEFAULT_SERVICES = [
  'Companion', 'Dinner Date', 'Social Events', 'Travel Companion', 'Business Events',
  'Party Companion', 'City Tour Guide', 'Shopping Companion', 'Cultural Events', 'Photography Model'
];

export const DEFAULT_TAGS = [
  'professional', 'friendly', 'elegant', 'sophisticated', 'multilingual',
  'experienced', 'reliable', 'discreet', 'charming', 'educated',
  'stylish', 'outgoing', 'cultured', 'articulate', 'versatile'
];