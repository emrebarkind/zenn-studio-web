// Hero visual: what a hybrid member's week can look like. Explicitly labelled
// as an example — it is not a live timetable.

const week = [
  { day: "Pzt", time: "19:00", what: "Reformer Pilates", where: "Stüdyoda", live: false },
  { day: "Çar", time: "08:00", what: "Mat Pilates", where: "Canlı online, evinden", live: true },
  { day: "Cum", time: "19:00", what: "Reformer Pilates", where: "Stüdyoda", live: false },
  { day: "Cmt", time: "Kendi saatinde", what: "Kickboks programı", where: "Evde", live: false },
];

export function SampleWeek() {
  return (
    <figure className="on-ink rounded-[28px] bg-ink p-5 text-paper shadow-[0_30px_60px_-30px_rgba(21,25,21,0.6)] sm:p-7">
      <figcaption className="flex items-baseline justify-between">
        <span className="font-display text-xl font-semibold tracking-tight">Örnek bir hafta</span>
        <span className="text-sm text-paper/60">Hibrit üyelik</span>
      </figcaption>
      <ol className="mt-6 space-y-2">
        {week.map((row) => (
          <li
            key={row.day + row.what}
            className="grid grid-cols-[3rem_1fr] items-center gap-4 rounded-2xl bg-paper/[0.06] px-4 py-3.5"
          >
            <span className="font-display text-lg font-bold tracking-tight text-paper/80">{row.day}</span>
            <span>
              <span className="flex items-center gap-2 font-semibold">
                {row.what}
                {row.live && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-2 py-0.5 text-xs font-semibold text-ink">
                    <span className="live-dot size-1.5 rounded-full bg-ink" aria-hidden />
                    Canlı
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-sm text-paper/60 tabular-nums">
                {row.time}, {row.where.toLocaleLowerCase("tr")}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
