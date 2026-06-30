import type { Day, OpeningHours as OpeningHoursType, DaySchedule } from '@restaurant/schemas';
import { cn } from '../../lib/cn';

const DAY_ORDER: readonly Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABEL: Record<Day, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export interface OpeningHoursProps {
  hours: OpeningHoursType;
  className?: string;
}

export function OpeningHours({ hours, className }: OpeningHoursProps) {
  const byDay = indexByDay(hours.schedule);
  return (
    <section className={cn('w-full max-w-md', className)} aria-label="Opening hours">
      <h3 className="text-2xl mb-4">Opening hours</h3>
      <dl className="space-y-1">
        {DAY_ORDER.map((day) => (
          <DayRow key={day} day={day} schedule={byDay.get(day)} />
        ))}
      </dl>
      {hours.note ? <p className="mt-4 text-sm text-(--color-ink)/70">{hours.note}</p> : null}
    </section>
  );
}

function DayRow({ day, schedule }: { day: Day; schedule: DaySchedule | undefined }) {
  return (
    <div className="flex justify-between text-sm">
      <dt className="font-medium">{DAY_LABEL[day]}</dt>
      <dd className="tabular-nums">{formatSchedule(schedule)}</dd>
    </div>
  );
}

function formatSchedule(schedule: DaySchedule | undefined): string {
  if (!schedule) return 'Closed';
  if (schedule.closed) return 'Closed';
  if (!schedule.open || !schedule.close) return '—';
  return `${schedule.open} – ${schedule.close}`;
}

function indexByDay(schedule: DaySchedule[]): Map<Day, DaySchedule> {
  return new Map(schedule.map((s) => [s.day, s]));
}
