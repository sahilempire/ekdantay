import type { Service } from './types'

/** Copy transcribed verbatim from legacy/index.html. */
export const services: Service[] = [
  {
    slug: 'teeth-whitening',
    title: 'Teeth Whitening',
    icon: 'Sparkles',
    blurb:
      'Professional teeth whitening treatments to brighten your smile and boost your confidence.',
  },
  {
    slug: 'teeth-cleaning',
    title: 'Teeth Cleaning',
    icon: 'Droplets',
    blurb:
      'Regular dental cleanings and preventive care to maintain optimal oral health.',
  },
  {
    slug: 'orthodontics',
    title: 'Orthodontics',
    icon: 'AlignCenter',
    blurb: 'Modern braces and aligners to straighten teeth and correct bite issues.',
  },
  {
    slug: 'pain-free-treatment',
    title: 'Pain-Free Treatment',
    icon: 'HeartHandshake',
    blurb:
      'Advanced anesthesia techniques ensuring comfortable and pain-free dental procedures.',
  },
  {
    slug: 'dental-implants',
    title: 'Dental Implants',
    icon: 'Anchor',
    blurb: 'Complete tooth replacement solutions that look and function naturally.',
  },
  {
    slug: 'emergency-care',
    title: 'Emergency Care',
    icon: 'Siren',
    blurb: 'Round-the-clock dental emergency services when you need them most.',
  },
]

/** Options offered in the appointment form's service select. */
export const bookableServices = [
  { value: 'general-checkup', label: 'General Checkup' },
  { value: 'teeth-whitening', label: 'Teeth Whitening' },
  { value: 'teeth-cleaning', label: 'Teeth Cleaning' },
  { value: 'orthodontics', label: 'Orthodontics' },
  { value: 'dental-implant', label: 'Dental Implant' },
  { value: 'emergency', label: 'Emergency Care' },
] as const
