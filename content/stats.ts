import type { StatSet } from './types'

/**
 * The legacy site carried two contradictory sets of numbers: the homepage was
 * updated to real figures, the other three pages were not. Both are ported so
 * each page renders what it rendered before (spec 4.2).
 *
 * statsInner claims 4,500 qualified dentists, which is template data - the
 * homepage says 2. Reconciling them is the deferred cleanup, not this change.
 */
export const statsHome: StatSet[] = [
  { label: 'Years of Experience', value: 4 },
  { label: 'Qualified Dentists',  value: 2 },
  { label: 'Happy Patients',      value: 1080 },
]

export const statsInner: StatSet[] = [
  { label: 'Years of Experience',   value: 14 },
  { label: 'Qualified Dentist',     value: 4500 },
  { label: 'Happy Smiling Customer', value: 4200 },
  { label: 'Patients Per Year',     value: 320 },
]
