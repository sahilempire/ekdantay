import type { Clinic } from './types'

/**
 * The single source of truth for clinic contact facts.
 *
 * On the legacy site the real address appeared in three footers and a
 * placeholder San Francisco address in four others, because each page carried
 * its own copy. Everything now reads from here, so that class of drift cannot
 * recur.
 */
export const clinic: Clinic = {
  name: 'Ekdantay Dental Clinic',
  tagline: 'Modern Dentistry in a Calm and Relaxed Environment',

  phone: {
    display: '+91 95878 15285',
    tel: 'tel:+919587815285',
    whatsapp: '919587815285',
  },

  email: 'info@ekdantay.com',

  address: {
    lines: [
      '8, Janta Dharmshala, near Mahila Thana',
      'Housing Board, Sawai Madhopur',
      'Alanpur Rural, Rajasthan 322001',
    ],
    mapQuery:
      'Ekdantay Dental Clinic, 8 Janta dharmshala, near Mahila Thana, Housing Board, Sawai Madhopur, Alanpur Rural, Rajasthan 322001',
  },

  hours: {
    weekdays: { label: 'Monday — Saturday', open: '10:30', close: '17:30' },
    sunday: { label: 'Sunday', open: '12:00', close: '16:00' },
    emergency: 'Available 24/7 for dental emergencies',
  },

  socials: {
    facebook:
      'https://www.facebook.com/people/Dental-solutions-in-ekdantay-by-Dr-Divya-bharti/61556193669620/',
    instagram: 'https://www.instagram.com/ekdantay.dental.care/',
  },

  credit: {
    name: 'Sahil Gupta',
    url: 'https://www.linkedin.com/in/sahilempire',
  },
}
