import type { PricingTier } from './types'

/** The real rupee pricing from legacy/index.html. */
export const pricingINR: PricingTier[] = [
  {
    title: 'Basic Checkup',
    amount: '₹800',
    unit: '/ visit',
    features: ['Dental Examination', 'Oral Health Assessment', 'Treatment Planning', 'Consultation'],
  },
  {
    title: 'Teeth Whitening',
    amount: '₹3,500',
    unit: '/ session',
    features: ['Professional Whitening', 'Shade Assessment', 'Aftercare Guidance', 'Follow-up Check'],
  },
  {
    title: 'Dental Implant',
    amount: '₹25,000',
    unit: '/ tooth',
    features: ['Implant Placement', 'Crown Fitting', 'Surgical Procedure', 'Post-op Care'],
  },
  {
    title: 'Orthodontic Treatment',
    amount: '₹45,000',
    unit: '/ treatment',
    features: ['Braces or Aligners', 'Regular Adjustments', 'Progress Monitoring', 'Retainer Fitting'],
  },
]

/**
 * The DentaCare template's dollar pricing, ported verbatim from
 * legacy/services.html and legacy/doctors.html (spec 4.2).
 *
 * Two things are wrong with it and both are intentional here: the currency is
 * USD on an Indian clinic site, and all four tiers list identical features,
 * which makes the tiers meaningless. Fixing that is the deferred cleanup.
 */
export const pricingUSD: PricingTier[] = (
  [
    ['Basic', '$24.50'],
    ['Standard', '$34.50'],
    ['Premium', '$54.50'],
    ['Platinum', '$89.50'],
  ] as const
).map(([title, amount]) => ({
  title,
  amount,
  unit: '/ session',
  features: [
    'Diagnostic Services',
    'Professional Consultation',
    'Tooth Implants',
    'Surgical Extractions',
    'Teeth Whitening',
  ],
}))
