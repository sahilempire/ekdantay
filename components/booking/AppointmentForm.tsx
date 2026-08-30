'use client'

import { useId, useMemo, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { getSlotsForDate, formatSlot, todayISO, parseDateInput } from '@/lib/hours'
import { buildWhatsAppUrl, type BookingData } from '@/lib/whatsapp'
import { bookableServices } from '@/content/services'
import { Button } from '@/components/ui/Button'

/**
 * One component, mounted wherever a booking form is needed.
 *
 * The legacy homepage had two separate forms that shared DOM ids
 * (appointment_name, appointment_email). jQuery's $('#id') returns the first
 * match, so the modal form read the hero form's empty inputs and every
 * submission failed validation - the site's main conversion path was dead.
 *
 * Two things are needed to make that impossible rather than merely unlikely:
 * React-scoped state, and useId() so the DOM ids are unique per instance.
 * State alone is not enough - the first version of this component hardcoded
 * its ids and reproduced the original collision, which the test suite caught.
 */

const field =
  'w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-accent'

const label = 'block text-sm font-medium mb-1.5'

type Errors = Partial<Record<keyof BookingData, string>>

export function AppointmentForm({ onDone }: { onDone?: () => void }) {
  // Scopes every input id to this instance. Without it, rendering the form
  // twice on one page recreates the exact duplicate-id collision that broke
  // the legacy site - React-scoped *state* is not enough on its own, the DOM
  // ids have to be unique too.
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`

  const [values, setValues] = useState<BookingData>({
    name: '', phone: '', service: '', date: '', time: '', message: '',
  })
  const [errors, setErrors] = useState<Errors>({})

  // Slots follow the chosen date, so a Sunday shows the shorter window and
  // nothing before opening is ever offered.
  const slots = useMemo(() => {
    const d = parseDateInput(values.date)
    return d ? getSlotsForDate(d) : []
  }, [values.date])

  function set<K extends keyof BookingData>(key: K, value: BookingData[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): Errors {
    const e: Errors = {}
    if (!values.name.trim()) e.name = 'Please tell us your name.'
    if (!values.phone.trim()) e.phone = 'We need a number to confirm your appointment.'
    else if (values.phone.replace(/\D/g, '').length < 10) e.phone = 'That number looks too short.'
    if (!values.date) e.date = 'Choose a date.'
    if (!values.time) e.time = 'Choose a time.'
    return e
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // No fake success state. The WhatsApp thread is the confirmation.
    window.open(buildWhatsAppUrl(values), '_blank', 'noopener,noreferrer')
    onDone?.()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={id("name")}>Full name *</label>
          <input
            id={id("name")} className={field} value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? id('name-err') : undefined}
            placeholder="Your name"
          />
          {errors.name && <p id={id('name-err')} className="mt-1 text-xs text-danger">{errors.name}</p>}
        </div>

        <div>
          <label className={label} htmlFor={id("phone")}>Phone number *</label>
          <input
            id={id("phone")} type="tel" className={field} value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? id('phone-err') : undefined}
            placeholder="+91 "
          />
          {errors.phone && <p id={id('phone-err')} className="mt-1 text-xs text-danger">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className={label} htmlFor={id("service")}>Service</label>
        <select
          id={id("service")} className={field} value={values.service}
          onChange={(e) => set('service', e.target.value)}
        >
          <option value="">Select a service</option>
          {bookableServices.map((s) => (
            <option key={s.value} value={s.label}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={id("date")}>Preferred date *</label>
          <input
            id={id("date")} type="date" className={field} value={values.date}
            min={todayISO()}
            onChange={(e) => { set('date', e.target.value); set('time', '') }}
            aria-invalid={!!errors.date}
          />
          {errors.date && <p className="mt-1 text-xs text-danger">{errors.date}</p>}
        </div>

        <div>
          <label className={label} htmlFor={id("time")}>Preferred time *</label>
          <select
            id={id("time")} className={field} value={values.time}
            onChange={(e) => set('time', e.target.value)}
            disabled={!values.date}
            aria-invalid={!!errors.time}
          >
            <option value="">{values.date ? 'Select time' : 'Pick a date first'}</option>
            {slots.map((s) => (
              <option key={s} value={s}>{formatSlot(s)}</option>
            ))}
          </select>
          {errors.time && <p className="mt-1 text-xs text-danger">{errors.time}</p>}
        </div>
      </div>

      <div>
        <label className={label} htmlFor={id("message")}>Anything we should know?</label>
        <textarea
          id={id("message")} rows={3} className={field} value={values.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Optional — symptoms, concerns, or questions"
        />
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full">
        <MessageCircle size={17} aria-hidden />
        Send booking on WhatsApp
      </Button>

      <p className="text-center text-xs text-muted">
        Opens WhatsApp with your details filled in. We&rsquo;ll confirm in the chat.
      </p>
    </form>
  )
}
