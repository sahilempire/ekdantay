import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppointmentForm } from '@/components/booking/AppointmentForm'

/**
 * These tests exist to hold the two defects that were live on the old site:
 * time slots offered before the clinic opened, and a form that could never be
 * submitted because two forms shared DOM ids.
 */

beforeEach(() => {
  vi.restoreAllMocks()
})

function mockOpen() {
  const open = vi.fn()
  vi.stubGlobal('open', open)
  return open
}

describe('AppointmentForm validation', () => {
  it('does not open WhatsApp when required fields are empty', async () => {
    const open = mockOpen()
    const user = userEvent.setup()
    render(<AppointmentForm />)

    await user.click(screen.getByRole('button', { name: /send booking/i }))

    expect(open).not.toHaveBeenCalled()
    expect(screen.getByText(/please tell us your name/i)).toBeInTheDocument()
  })

  it('rejects a phone number that is too short to call back', async () => {
    const open = mockOpen()
    const user = userEvent.setup()
    render(<AppointmentForm />)

    await user.type(screen.getByLabelText(/full name/i), 'Asha Meena')
    await user.type(screen.getByLabelText(/phone/i), '12345')
    await user.click(screen.getByRole('button', { name: /send booking/i }))

    expect(open).not.toHaveBeenCalled()
    expect(screen.getByText(/looks too short/i)).toBeInTheDocument()
  })

  it('clears a field error once the patient corrects it', async () => {
    const user = userEvent.setup()
    render(<AppointmentForm />)

    await user.click(screen.getByRole('button', { name: /send booking/i }))
    expect(screen.getByText(/please tell us your name/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/full name/i), 'Asha')
    expect(screen.queryByText(/please tell us your name/i)).not.toBeInTheDocument()
  })
})

describe('AppointmentForm time slots', () => {
  it('disables the time select until a date is chosen', () => {
    render(<AppointmentForm />)
    expect(screen.getByLabelText(/preferred time/i)).toBeDisabled()
  })

  it('never offers a slot before the clinic opens', async () => {
    const user = userEvent.setup()
    render(<AppointmentForm />)

    // 2026-09-07 is a Monday: the clinic opens at 10:30.
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: '2026-09-07' },
    })

    const options = screen
      .getAllByRole('option')
      .map((o) => o.textContent ?? '')

    expect(options).toContain('10:30 AM')
    // All three of these were bookable on the legacy site.
    expect(options).not.toContain('9:00 AM')
    expect(options).not.toContain('9:30 AM')
    expect(options).not.toContain('10:00 AM')
  })

  it('offers the shorter Sunday window', async () => {
    const user = userEvent.setup()
    render(<AppointmentForm />)

    // 2026-09-06 is a Sunday: 12:00 to 16:00.
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: '2026-09-06' },
    })

    const options = screen.getAllByRole('option').map((o) => o.textContent ?? '')
    expect(options).toContain('12:00 PM')
    expect(options).not.toContain('10:30 AM')
    expect(options).not.toContain('4:00 PM')
  })
})

describe('AppointmentForm submission', () => {
  it('opens a correctly composed wa.me link when valid', async () => {
    const open = mockOpen()
    const user = userEvent.setup()
    render(<AppointmentForm />)

    await user.type(screen.getByLabelText(/full name/i), 'Asha Meena')
    await user.type(screen.getByLabelText(/phone/i), '+91 90000 11111')
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: '2026-09-07' },
    })
    await user.selectOptions(screen.getByLabelText(/preferred time/i), '10:30')
    await user.click(screen.getByRole('button', { name: /send booking/i }))

    expect(open).toHaveBeenCalledOnce()

    const url = new URL(open.mock.calls[0][0] as string)
    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe('/919587815285')

    const text = url.searchParams.get('text') ?? ''
    expect(text).toContain('Asha Meena')
    expect(text).toContain('+91 90000 11111')
  })

  it('renders independently when mounted twice, with no shared id collision', async () => {
    // The legacy bug in one assertion: two forms on one page must not
    // interfere. jQuery read the first #appointment_name for both.
    const user = userEvent.setup()
    render(
      <>
        <AppointmentForm />
        <AppointmentForm />
      </>,
    )

    const names = screen.getAllByLabelText(/full name/i)
    expect(names).toHaveLength(2)

    await user.type(names[1], 'Second Form')

    expect((names[0] as HTMLInputElement).value).toBe('')
    expect((names[1] as HTMLInputElement).value).toBe('Second Form')
  })
})
