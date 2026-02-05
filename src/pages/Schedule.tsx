import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPerformances } from '../api/performances';
import { getLocations } from '../api/locations';
import type { PerformanceDto } from '../types';
import type { LocationDto } from '../types';
import styles from './Schedule.module.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthStart(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getMonthEnd(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function getCalendarDays(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = first.getDay();
  const daysInMonth = last.getDate();
  const rows: (Date | null)[][] = [];
  let row: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) row.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    row.push(new Date(year, month, d));
    if (row.length === 7) {
      rows.push(row);
      row = [];
    }
  }
  if (row.length) {
    while (row.length < 7) row.push(null);
    rows.push(row);
  }
  return rows;
}

function isToday(d: Date): boolean {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

export function Schedule() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [viewDate, setViewDate] = useState(() => new Date());
  const [performances, setPerformances] = useState<PerformanceDto[]>([]);
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const start = getMonthStart(viewDate);
    const end = getMonthEnd(viewDate);
    Promise.all([getPerformances(start, end), getLocations()])
      .then(([perfs, locs]) => {
        setPerformances(perfs);
        setLocations(locs);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [viewDate]);

  const colorByLocationId: Record<number, string> = {};
  locations.forEach((loc) => {
    if (loc.colorCode) colorByLocationId[loc.locationId] = loc.colorCode;
  });

  const performancesByDate: Record<string, PerformanceDto[]> = {};
  performances.forEach((p) => {
    const key = p.performanceDatetime.slice(0, 10);
    if (!performancesByDate[key]) performancesByDate[key] = [];
    performancesByDate[key].push(p);
  });

  const calendarRows = getCalendarDays(year, month);

  const goPrev = () => {
    if (viewMode === 'month') setViewDate(new Date(year, month - 1));
    else if (viewMode === 'week') setViewDate(new Date(viewDate.setDate(viewDate.getDate() - 7)));
    else setViewDate(new Date(viewDate.setDate(viewDate.getDate() - 1)));
  };
  const goNext = () => {
    if (viewMode === 'month') setViewDate(new Date(year, month + 1));
    else if (viewMode === 'week') setViewDate(new Date(viewDate.setDate(viewDate.getDate() + 7)));
    else setViewDate(new Date(viewDate.setDate(viewDate.getDate() + 1)));
  };
  const goToday = () => setViewDate(new Date());

  const renderMonthView = () => {
    return (
      <div className={styles.calendarGrid}>
        {WEEKDAYS.map((wd, i) => (
          <div key={wd} className={`${styles.weekdayHeader} ${i === 0 || i === 6 ? styles.sunday : ''}`}>
            {wd}
          </div>
        ))}
        {calendarRows.flat().map((d, i) => {
          if (!d) {
            return <div key={`empty-${i}`} className={`${styles.dayCell} ${styles.otherMonth}`} />;
          }
          const key = d.toISOString().slice(0, 10);
          const dayPerfs = performancesByDate[key] || [];
          const weekend = d.getDay() === 0 || d.getDay() === 6;
          return (
            <div
              key={key}
              className={`${styles.dayCell} ${isToday(d) ? styles.today : ''} ${d.getMonth() !== month ? styles.otherMonth : ''}`}
            >
              <div className={`${styles.dayNum} ${weekend ? styles.weekend : ''}`}>{d.getDate()}</div>
              <div className={styles.events}>
                {dayPerfs.slice(0, 4).map((p) => {
                  const color = (p.locationId && colorByLocationId[p.locationId]) || 'yellow';
                  const colorClass = color === 'green' ? styles.eventChipGreen : color === 'red' ? styles.eventChipRed : styles.eventChipYellow;
                  return (
                    <div key={p.performanceId} className={`${styles.eventChip} ${colorClass}`}>
                      {p.title}
                    </div>
                  );
                })}
                {dayPerfs.length > 4 && <div className={styles.eventChip}>+{dayPerfs.length - 4}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(viewDate);
    startOfWeek.setDate(viewDate.getDate() - viewDate.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    return (
      <div className={styles.weekGrid}>
        {weekDays.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const dayPerfs = performancesByDate[key] || [];
          return (
            <div key={key} className={styles.weekColumn}>
              <div className={`${styles.weekHeader} ${d.getDay() === 0 || d.getDay() === 6 ? styles.weekend : ''}`}>
                {WEEKDAYS[d.getDay()]} {d.getDate()}
              </div>
              <div className={styles.weekEvents}>
                {dayPerfs.map((p) => {
                  const color = (p.locationId && colorByLocationId[p.locationId]) || 'yellow';
                  const colorClass = color === 'green' ? styles.eventChipGreen : color === 'red' ? styles.eventChipRed : styles.eventChipYellow;
                  return (
                    <div key={p.performanceId} className={`${styles.eventChip} ${colorClass}`}>
                      <div className={styles.eventTime}>{p.performanceDatetime.slice(11, 16)}</div>
                      <div className={styles.eventTitle}>{p.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const key = viewDate.toISOString().slice(0, 10);
    const dayPerfs = performancesByDate[key] || [];
    return (
      <div className={styles.dayView}>
        <div className={styles.dayViewHeader}>
          {viewDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div className={styles.dayEventsList}>
          {dayPerfs.length === 0 ? (
            <div className={styles.noEvents}>No performances scheduled for today.</div>
          ) : (
            dayPerfs.map((p) => {
              const color = (p.locationId && colorByLocationId[p.locationId]) || 'yellow';
              const colorClass = color === 'green' ? styles.eventChipGreen : color === 'red' ? styles.eventChipRed : styles.eventChipYellow;
              return (
                <div key={p.performanceId} className={`${styles.dayEventItem} ${colorClass}`}>
                  <span className={styles.dayEventTime}>{p.performanceDatetime.slice(11, 16)}</span>
                  <span className={styles.dayEventTitle}>{p.title}</span>
                  <span className={styles.dayEventLocation}>{locations.find(l => l.locationId === p.locationId)?.nameEn}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.legend}>
        {locations.map((loc) => (
          <div key={loc.locationId} className={styles.legendItem}>
            <div className={`${styles.legendColor} ${loc.colorCode ? styles[loc.colorCode as keyof typeof styles] : ''}`} style={loc.colorCode && !styles[loc.colorCode as keyof typeof styles] ? { background: loc.colorCode } : undefined} />
            <span>{loc.nameEn}</span>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={styles.viewToggle}>
          <button type="button" className={viewMode === 'month' ? styles.active : ''} onClick={() => setViewMode('month')}>Month</button>
          <button type="button" className={viewMode === 'week' ? styles.active : ''} onClick={() => setViewMode('week')}>Week</button>
          <button type="button" className={viewMode === 'day' ? styles.active : ''} onClick={() => setViewMode('day')}>Day</button>
        </div>
        <div className={styles.monthNav}>
          <button type="button" onClick={goPrev} aria-label="이전">‹</button>
          <span>{viewMode === 'month' ? monthLabel : viewDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          <button type="button" onClick={goNext} aria-label="다음">›</button>
        </div>
        <button type="button" className={styles.todayBtn} onClick={goToday}>Today</button>
      </div>

      <div className={styles.calendar}>
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        <Link to="/location">Find a BuskPort on map →</Link>
      </p>
    </div>
  );
}
