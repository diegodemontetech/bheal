export interface Card {
  // ... existing fields ...
  clientRegistered?: boolean;
  registrationStatus?: 'pending' | 'approved' | 'rejected';
  registrationDate?: string;
  registrationNotes?: string;
  cep?: string;
}

export interface Permission {
  name: string;
  key: string;
  description: string;
}

export interface UserGroup {
  id: string;
  name: string;
  permissions: string[];
}