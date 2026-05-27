/**
 * LockedVideo — the "you haven't bought this course yet" placeholder.
 *
 * Visual requirements (from the spec):
 *   - Must look like a video player (so the user understands what they're missing)
 *   - Must be CLEARLY locked — a lock icon overlay and a "Purchase to unlock" CTA
 *   - The button does nothing (no auth/payment in this build)
 *
 * Design goals:
 *   - Obvious it's locked at a glance (high contrast overlay, not a subtle hint)
 *   - Still feels premium, not broken
 *   - Communicates the value behind the lock (e.g. price, lesson count, or duration)
 */

type Props = {
  price: number;
};

export function LockedVideo({ price }: Props) {
  // TODO(user): Build the locked video UI here.
  //
  // Suggested structure:
  //   <div className="relative aspect-video rounded-2xl overflow-hidden ...">
  //     {/* 1. A "video-like" background — gradient, blurred thumbnail, or dark surface */}
  //     {/* 2. A centered lock icon (inline SVG is easiest — no extra deps) */}
  //     {/* 3. A heading like "Course video locked" + subtext */}
  //     {/* 4. A "Purchase to unlock — ${price}" button (onClick does nothing) */}
  //   </div>
  //
  // Trade-offs to think about:
  //   - Aggressive (dark scrim + big lock) vs. subtle (faded thumbnail + small badge)
  //     — aggressive makes the gate obvious; subtle teases the content more.
  //   - Show the price on the button itself? Reduces friction by removing one mental step,
  //     but duplicates the price already shown in the sidebar.
  //   - Use `aspect-video` (16:9) so it reads as a video player even when empty.

  return (
    <div className="relative aspect-video rounded-2xl border border-dashed border-neutral-300 grid place-items-center text-neutral-400 text-sm">
      LockedVideo placeholder — implement me (price: ${price})
    </div>
  );
}
