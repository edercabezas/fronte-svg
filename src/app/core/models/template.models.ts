export interface CertificationTemplate {
  id: number;
  name: string;
  description?: string;
  durationHours?: number;
  validityMonths?: number;
  type?: string;
  active: boolean;
}
