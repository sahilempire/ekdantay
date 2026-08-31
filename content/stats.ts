import type { StatSet } from './types'

/**
 * The clinic's numbers.
 *
 * There used to be two contradictory sets. The legacy homepage carried real
 * figures; about, services and doctors carried the DentaCare template's, which
 * claimed 4,500 qualified dentists and 14 years of experience for a practice
 * with two dentists. Both were ported so each page rendered what it rendered
 * before, on the understanding that reconciling them was a later job.
 *
 * This is that job. Three pages were making false claims about a medical
 * business to anyone who scrolled past the team, which is a different class of
 * placeholder from a stock photo. One set now, used everywhere.
 */
export const stats: StatSet[] = [
  { label: 'Years of Experience', value: 4 },
  { label: 'Qualified Dentists',  value: 2 },
  { label: 'Happy Patients',      value: 1080 },
]
