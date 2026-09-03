export type EvidenceType = 'photo' | 'document' | 'excel' | 'other';

export interface EvidenceFile {
  id: number;
  eventId: number;
  uploadedBy: number;
  uploadedByName?: string;
  type: EvidenceType;
  originalName: string;
  storedPath: string;
  thumbnailPath?: string;
  mimeType: string;
  fileSize: number;
  description?: string;
  createdAt: string;
}

export interface UploadEvidenceRequest {
  description?: string;
  type?: EvidenceType;
}
