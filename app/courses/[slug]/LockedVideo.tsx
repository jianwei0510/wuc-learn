type Props = {
  price: number;
};

export function LockedVideo({ price }: Props) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.35),transparent_32%),linear-gradient(135deg,rgba(20,184,166,0.16),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/15">
        Lesson preview
      </div>
      <div className="relative grid h-full place-items-center p-6 text-center">
        <div>
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
            <svg
              aria-hidden="true"
              className="size-7"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight">
            Course video locked
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/70">
            This lesson is part of the paid course. Purchase the course to unlock
            the full video.
          </p>
          <button className="mt-6 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400">
            Purchase to unlock — ${price}
          </button>
        </div>
      </div>
    </div>
  );
}
