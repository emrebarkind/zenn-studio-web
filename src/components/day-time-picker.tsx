import { ChevronDown } from "lucide-react";
import { HOURS, WEEKDAYS } from "@/domain/registration";

const select =
  "block min-h-12 w-full appearance-none rounded-2xl bg-paper px-4 pr-10 text-[16px] ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-ink aria-invalid:ring-2 aria-invalid:ring-danger";

function HourSelect({ name, label, hours, defaultValue, invalid }: { name: string; label: string; hours: string[]; defaultValue: string; invalid?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="relative mt-1.5 block">
        <select name={name} defaultValue={defaultValue} aria-invalid={invalid} className={select}>
          <option value="">Fark etmez</option>
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-soft" />
      </span>
    </label>
  );
}

/**
 * Which days suit the visitor and between which hours. Both optional; the
 * coach uses them to offer a time on the call. Plain form fields (`days`,
 * `timeFrom`, `timeTo`), so it works inside either request form.
 */
export function DayTimePicker({
  days = [],
  timeFrom = "",
  timeTo = "",
  error,
}: {
  days?: string[];
  timeFrom?: string;
  timeTo?: string;
  error?: string;
}) {
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold">
          Hangi günler uygun? <span className="font-normal text-ink-soft">(isteğe bağlı)</span>
        </legend>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((d) => (
            <label
              key={d.id}
              className="grid min-h-12 cursor-pointer place-items-center rounded-2xl bg-paper text-sm font-semibold ring-1 ring-ink/15 transition-colors has-[:checked]:bg-ink has-[:checked]:text-paper has-[:checked]:ring-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
            >
              <input type="checkbox" name="days" value={d.id} defaultChecked={days.includes(d.id)} className="sr-only" />
              {d.label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold">
          Saat aralığı <span className="font-normal text-ink-soft">(isteğe bağlı)</span>
        </legend>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <HourSelect name="timeFrom" label="En erken" hours={HOURS.slice(0, -1)} defaultValue={timeFrom} />
          <HourSelect name="timeTo" label="En geç" hours={HOURS.slice(1)} defaultValue={timeTo} invalid={!!error} />
        </div>
        {error && <p className="mt-2 text-sm font-medium text-danger">{error}</p>}
      </fieldset>
    </div>
  );
}
