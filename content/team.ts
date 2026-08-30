import type { StaffMember } from './types'

/**
 * All eight entries from legacy/doctors.html, ported verbatim (spec 4.2).
 *
 * The last four are DentaCare template placeholders - note that "Ivan
 * Dorchsner" is listed as a System Analyst at a dental clinic. They are
 * flagged `real: false` rather than removed, so the eventual cleanup is
 * `team.filter(m => m.real)` and nobody has to work out which is which.
 */
export const team: StaffMember[] = [
  { name: 'Dr. Divya Bharti',  role: 'Chief Dentist',     image: '/images/divya.webp',         real: true  },
  { name: 'Dr. Yamini Sharma', role: 'Assistant Dentist', image: '/images/yamini.webp',        real: true  },
  { name: 'Gungun Rajput',     role: 'Receptionist',      image: '/images/Gungun-Rajput.webp', real: true  },
  { name: 'Vijay Gurjar',      role: 'Hygienist',         image: '/images/vijay.webp',         real: true  },
  { name: 'Tom Smith',         role: 'Dentist',           image: '/images/person_1.webp',      real: false },
  { name: 'Mark Wilson',       role: 'Dentist',           image: '/images/person_2.webp',      real: false },
  { name: 'Patrick Jacobson',  role: 'Dentist',           image: '/images/person_3.webp',      real: false },
  { name: 'Ivan Dorchsner',    role: 'System Analyst',    image: '/images/person_4.webp',      real: false },
]
