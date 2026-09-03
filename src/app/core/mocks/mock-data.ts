import { User } from '../models/user.models';
import { Event } from '../models/event.models';
import { Participant } from '../models/participant.models';
import { EvidenceFile } from '../models/evidence.models';
import { Expense } from '../models/expense.models';
import { CertificationTemplate } from '../models/template.models';

export const MOCK_TEMPLATES: CertificationTemplate[] = [
  { id: 1, name: 'Certificado Estándar', description: 'Plantilla de certificación estándar para eventos de capacitación', durationHours: 8, validityMonths: 24, type: 'Capacitación', active: true },
];

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin Master', email: 'admin@empresa.com', role: 'administrador', isActive: true, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z' },
  { id: 2, name: 'Carlos López', email: 'carlos@empresa.com', role: 'capacitador', isActive: true, createdAt: '2026-02-01T08:00:00Z', updatedAt: '2026-02-01T08:00:00Z' },
  { id: 3, name: 'María Gómez', email: 'maria@empresa.com', role: 'administrativo', isActive: true, createdAt: '2026-02-15T09:30:00Z', updatedAt: '2026-03-01T11:00:00Z' },
  { id: 4, name: 'Jhon Pérez', email: 'jhon@empresa.com', role: 'capacitador', isActive: false, createdAt: '2026-03-05T07:00:00Z', updatedAt: '2026-04-10T14:00:00Z' },
];

export const MOCK_EVENTS: Event[] = [
  { id: 1, name: 'Certificación Seguridad Industrial Q1', description: 'Capacitación en normas de seguridad para planta de producción.', location: 'Planta Norte - Sala A', city: 'Bogotá', startDate: '2026-04-10T08:00:00Z', endDate: '2026-04-10T17:00:00Z', status: 'completed', modality: 'Presencial', maxCapacity: 30, templateId: 1, templateName: 'Certificado Estándar', createdBy: 1, createdByName: 'Admin Master', trainerIds: [2], trainers: [{ id: 2, name: 'Carlos López' }], participantsCount: 24, certifiedCount: 20, createdAt: '2026-03-25T10:00:00Z', updatedAt: '2026-04-11T09:00:00Z' },
  { id: 2, name: 'Inducción Equipos de Protección Personal', description: 'Uso correcto de EPP para operarios de línea.', location: 'Sala de Capacitación B2', city: 'Medellín', startDate: '2026-05-15T07:30:00Z', endDate: '2026-05-15T15:00:00Z', status: 'completed', modality: 'Presencial', maxCapacity: 20, templateId: 1, templateName: 'Certificado Estándar', createdBy: 1, createdByName: 'Admin Master', trainerIds: [2], trainers: [{ id: 2, name: 'Carlos López' }], participantsCount: 18, certifiedCount: 17, createdAt: '2026-05-01T10:00:00Z', updatedAt: '2026-05-16T08:00:00Z' },
  { id: 3, name: 'Manejo de Maquinaria Pesada - Nivel 2', description: 'Certificación avanzada para operadores de maquinaria.', location: 'Patio de Maniobras', city: 'Cali', startDate: '2026-06-20T08:00:00Z', endDate: '2026-06-21T17:00:00Z', status: 'active', modality: 'Presencial', maxCapacity: 15, templateId: 1, templateName: 'Certificado Estándar', createdBy: 2, createdByName: 'Carlos López', trainerIds: [2], trainers: [{ id: 2, name: 'Carlos López' }], participantsCount: 12, certifiedCount: 0, createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z' },
  { id: 4, name: 'Primeros Auxilios y RCP', description: 'Capacitación en primeros auxilios básicos y reanimación.', location: 'Auditorio Principal', city: 'Bogotá', startDate: '2026-07-08T09:00:00Z', endDate: '2026-07-08T17:00:00Z', status: 'draft', modality: 'Presencial', maxCapacity: 40, templateId: 1, templateName: 'Certificado Estándar', createdBy: 1, createdByName: 'Admin Master', trainerIds: [], trainers: [], participantsCount: 0, certifiedCount: 0, createdAt: '2026-06-05T14:00:00Z', updatedAt: '2026-06-05T14:00:00Z' },
  { id: 5, name: 'Gestión Ambiental ISO 14001', description: 'Formación en sistemas de gestión ambiental.', location: 'Centro de Formación Externo', city: 'Barranquilla', startDate: '2026-07-22T08:00:00Z', endDate: '2026-07-23T17:00:00Z', status: 'draft', modality: 'Virtual', maxCapacity: 50, templateId: 1, templateName: 'Certificado Estándar', createdBy: 1, createdByName: 'Admin Master', trainerIds: [], trainers: [], participantsCount: 0, certifiedCount: 0, createdAt: '2026-06-06T10:00:00Z', updatedAt: '2026-06-06T10:00:00Z' },
];

export const MOCK_PARTICIPANTS: Participant[] = [
  { id: 1, eventId: 1, name: 'Pedro Ramírez', documentType: 'CC', documentId: '12345678', email: 'pedro@op.com', phone: '3001234567', company: 'Operaciones SA', position: 'Operario', score: 92, passed: true, certificationStatus: 'approved', certificationDate: '2026-04-10', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-11T09:00:00Z' },
  { id: 2, eventId: 1, name: 'Ana Torres', documentType: 'CC', documentId: '87654321', email: 'ana@op.com', phone: '3109876543', company: 'Operaciones SA', position: 'Supervisora', score: 88, passed: true, certificationStatus: 'approved', certificationDate: '2026-04-10', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-11T09:00:00Z' },
  { id: 3, eventId: 1, name: 'Luis Martínez', documentType: 'CC', documentId: '11223344', email: 'luis@op.com', phone: '3201112233', company: 'Mantenimiento Ltd', position: 'Técnico', score: 55, passed: false, certificationStatus: 'failed', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-11T09:00:00Z' },
  { id: 4, eventId: 1, name: 'Sara Díaz', documentType: 'CC', documentId: '44556677', email: 'sara@op.com', phone: '3154455667', company: 'Operaciones SA', position: 'Analista', score: 95, passed: true, certificationStatus: 'approved', certificationDate: '2026-04-10', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-11T09:00:00Z' },
  { id: 5, eventId: 3, name: 'Roberto Cano', documentType: 'CC', documentId: '99887766', email: 'roberto@maq.com', phone: '3019988776', company: 'Maquinaria Co', position: 'Operador', score: undefined, passed: false, certificationStatus: 'pending', createdAt: '2026-06-05T10:00:00Z', updatedAt: '2026-06-05T10:00:00Z' },
  { id: 6, eventId: 3, name: 'Fernanda Ruiz', documentType: 'CC', documentId: '55443322', email: 'fernanda@maq.com', phone: '3165544332', company: 'Maquinaria Co', position: 'Operadora', score: undefined, passed: false, certificationStatus: 'pending', createdAt: '2026-06-05T10:00:00Z', updatedAt: '2026-06-05T10:00:00Z' },
];

export const MOCK_EVIDENCE: EvidenceFile[] = [
  { id: 1, eventId: 1, uploadedBy: 2, uploadedByName: 'Carlos López', type: 'photo', originalName: 'grupo_inicio.jpg', storedPath: '/uploads/events/1/grupo_inicio.jpg', thumbnailPath: '/uploads/thumbs/1/grupo_inicio.jpg', mimeType: 'image/jpeg', fileSize: 2048000, description: 'Foto de inicio de la certificación', createdAt: '2026-04-10T09:00:00Z' },
  { id: 2, eventId: 1, uploadedBy: 2, uploadedByName: 'Carlos López', type: 'photo', originalName: 'practica_extintor.jpg', storedPath: '/uploads/events/1/practica_extintor.jpg', thumbnailPath: '/uploads/thumbs/1/practica_extintor.jpg', mimeType: 'image/jpeg', fileSize: 1800000, description: 'Práctica con extintor', createdAt: '2026-04-10T11:30:00Z' },
  { id: 3, eventId: 1, uploadedBy: 2, uploadedByName: 'Carlos López', type: 'document', originalName: 'lista_asistencia.pdf', storedPath: '/uploads/events/1/lista_asistencia.pdf', mimeType: 'application/pdf', fileSize: 512000, description: 'Lista de asistencia firmada', createdAt: '2026-04-10T17:30:00Z' },
  { id: 4, eventId: 1, uploadedBy: 2, uploadedByName: 'Carlos López', type: 'excel', originalName: 'calificaciones.xlsx', storedPath: '/uploads/events/1/calificaciones.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileSize: 45000, description: 'Resultados del examen', createdAt: '2026-04-11T08:00:00Z' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 1, eventId: 1, registeredBy: 2, registeredByName: 'Carlos López', category: 'refreshments', description: 'Refrigerio mañana (café, jugo, pastelitos)', quantity: 24, unitPrice: 8500, amount: 204000, expenseDate: '2026-04-10', createdAt: '2026-04-10T10:00:00Z', updatedAt: '2026-04-10T10:00:00Z' },
  { id: 2, eventId: 1, registeredBy: 2, registeredByName: 'Carlos López', category: 'refreshments', description: 'Almuerzo participantes', quantity: 24, unitPrice: 18000, amount: 432000, expenseDate: '2026-04-10', createdAt: '2026-04-10T13:00:00Z', updatedAt: '2026-04-10T13:00:00Z' },
  { id: 3, eventId: 1, registeredBy: 2, registeredByName: 'Carlos López', category: 'materials', description: 'Cartillas de seguridad industrial', quantity: 25, unitPrice: 5000, amount: 125000, expenseDate: '2026-04-09', createdAt: '2026-04-09T16:00:00Z', updatedAt: '2026-04-09T16:00:00Z' },
  { id: 4, eventId: 1, registeredBy: 1, registeredByName: 'Admin Master', category: 'transport', description: 'Transporte instructor externo', quantity: 1, unitPrice: 85000, amount: 85000, expenseDate: '2026-04-10', createdAt: '2026-04-10T18:00:00Z', updatedAt: '2026-04-10T18:00:00Z' },
];
