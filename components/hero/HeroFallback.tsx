/**
 * The static state behind the 3D hero.
 *
 * Built first and deliberately: this is what phones, reduced-motion users and
 * everyone pre-hydration actually see, so it has to stand on its own rather
 * than read as a missing asset. Pure CSS - no canvas, no JS, no request.
 *
 * The composition mirrors the 3D scene's silhouette (one dominant soft form,
 * two smaller satellites, warm light from upper left) so switching between
 * them is not a visible jump.
 */
export function HeroFallback() {
  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-[2rem]"
      aria-hidden="true"
    >
      {/* ground */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_30%_20%,var(--surface-raised)_0%,var(--surface)_45%,var(--surface-sunk)_100%)]" />

      {/* warm studio key light, upper left */}
      <div
        className="absolute -left-[10%] -top-[10%] h-[70%] w-[70%] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, var(--glow-soft) 0%, transparent 70%)',
        }}
      />

      {/* dominant form */}
      <div
        className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-[42%_58%_54%_46%/48%_42%_58%_52%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.28)]"
        style={{
          background:
            'linear-gradient(145deg, var(--surface-raised) 0%, var(--accent-wash) 55%, var(--accent) 140%)',
        }}
      />

      {/* satellites */}
      <div
        className="absolute left-[18%] top-[26%] h-[15%] w-[15%] rounded-full opacity-90 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.25)]"
        style={{
          background: 'linear-gradient(160deg, var(--surface-raised), var(--accent-wash))',
        }}
      />
      <div
        className="absolute bottom-[20%] right-[20%] h-[10%] w-[10%] rounded-full opacity-80 shadow-[0_10px_20px_-8px_rgba(0,0,0,0.25)]"
        style={{
          background: 'linear-gradient(160deg, var(--glow-soft), var(--glow))',
        }}
      />

      {/* contact shadow grounding the composition */}
      <div
        className="absolute bottom-[14%] left-1/2 h-[6%] w-[46%] -translate-x-1/2 rounded-[50%] opacity-30 blur-xl"
        style={{ background: 'var(--ink)' }}
      />
    </div>
  )
}
