export type EventStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface TrainerRef {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  name: string;
  description?: string;
  location?: string;
  city: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  modality: string;
  maxCapacity: number;
  templateId: number;
  templateName?: string;
  createdBy: number;
  createdByName?: string;
  trainerIds: number[];
  trainers: TrainerRef[];
  participantsCount?: number;
  certifiedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  name: string;
  description?: string;
  location?: string;
  city: string;
  startDate: string;
  endDate: string;
  modality: string;
  maxCapacity: number;
  templateId: number;
  trainerIds: number[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface EventFilters {
  status?: EventStatus | '';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface BulkImportError {
  row: number;
  field: string;
  message: string;
}

export interface BulkImportResult {
  success: number;
  errors: BulkImportError[];
}
