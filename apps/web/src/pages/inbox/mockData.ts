import type { Conversation, ContactDetails, Message } from './types';

export const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Martín Gómez',
    company: 'TechCorp Solutions',
    initials: 'MG',
    status: 'online',
    lastMessage: 'Excelente, te envié la propuesta revisada...',
    time: '11:42',
    tag: { label: 'Calificado', tone: 'primary' },
  },
  {
    id: '2',
    name: 'Valeria Rios',
    company: 'FinPay LatAm',
    initials: 'VR',
    status: 'online',
    lastMessage: 'Nos gustaría coordinar una demo técnica con el equipo...',
    time: '10:15',
    unreadCount: 2,
    tag: { label: 'Demo', tone: 'amber' },
  },
  {
    id: '3',
    name: 'Carlos Benítez',
    company: 'Logix Cargo',
    initials: 'CB',
    status: 'offline',
    lastMessage: 'Quedamos a la espera del contrato firmado.',
    time: 'Ayer',
    tag: { label: 'Negociación', tone: 'neutral' },
  },
  {
    id: '4',
    name: 'Lucía Morales',
    company: 'SaaSify',
    initials: 'LM',
    status: 'away',
    lastMessage: '¿Tienen soporte 24/7 para el plan Enterprise?',
    time: 'Ayer',
    tag: { label: 'Nuevo Lead', tone: 'sky' },
  },
  {
    id: '5',
    name: 'Diego Herrera',
    company: 'CloudScale DevOps',
    initials: 'DH',
    status: 'offline',
    lastMessage: 'Te confirmo la reunión para el jueves a las 15hs.',
    time: '18 Mar',
  },
];

export const messagesByConversation: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      from: 'customer',
      authorName: 'Martín Gómez',
      text: 'Hola, pudimos revisar la presentación con el CTO. Nos interesa mucho la integración con nuestro stack actual. ¿Podrías enviarnos el desglose de precios para 50 puestos con soporte 24/7 incluido?',
      time: '11:18',
    },
    {
      id: 'm2',
      from: 'agent',
      authorName: 'Vos',
      text: '¡Hola Martín! Qué excelente noticia. Te armé una propuesta a medida con 18% de descuento por contratación anual, onboarding dedicado y migración sin costo.',
      time: '11:30',
    },
    {
      id: 'm3',
      from: 'customer',
      authorName: 'Martín Gómez',
      text: 'Excelente, te envié la propuesta revisada con el visto bueno legal. Si podemos agendar la llamada de cierre hoy a las 16:00 hs, avanzamos con la firma.',
      time: '11:42',
    },
  ],
};

export const contactDetailsByConversation: Record<string, ContactDetails> = {
  '1': {
    name: 'Martín Gómez',
    role: 'VP of Engineering',
    company: 'TechCorp Solutions',
    phone: '+54 9 11 4589-2310',
    email: 'martin.gomez@techcorp.io',
    companySize: '50-200 empleados',
    source: 'Campaña Meta Ads Q1',
    dealValue: '$45,000 ARR',
    pipelineStage: 'Propuesta enviada',
    pipelineStepIndex: 3,
    tags: ['Enterprise', 'Decisor Clave', 'Cierre Mes Actual'],
    note: 'El CTO prioriza la API REST y SSO SAML. El presupuesto ya está aprobado para Q2. Llamar puntual a las 16hs.',
  },
};
