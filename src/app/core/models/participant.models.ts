export type CertificationStatus = 'pending' | 'approved' | 'failed';
export type DocumentType = 'CC' | 'CE' | 'TI' | 'PA' | 'RC';

export interface Participant {
  id: number;
  eventId: number;
  name: string;
  documentType: DocumentType;
  documentId: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  age?: number;
  company?: string;
  position?: string;
  score?: number;
  passed: boolean;
  certificationStatus: CertificationStatus;
  certificationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicRegistrationRequest {
  eventId: number;
  name: string;
  documentType: DocumentType;
  documentId: string;
  phone: string;
  email: string;
  address: string;
}

export interface CreateParticipantRequest {
  name: string;
  documentType?: DocumentType;
  documentId: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  age?: number;
  company?: string;
  position?: string;
  score?: number;
  certificationStatus?: CertificationStatus;
}

export interface UpdateParticipantRequest extends Partial<CreateParticipantRequest> {
  passed?: boolean;
  certificationDate?: string;
}

export interface ImportResult {
  success: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}
