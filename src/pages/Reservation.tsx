import { useState, useEffect } from 'react';
import { getLocations } from '../api/locations';
import { createPerformance } from '../api/performances';
import type { LocationDto } from '../types';
import type { PerformanceDto } from '../types';
import styles from './Reservation.module.css';

const POSITIONS = ['Vocalist', 'Guitarist', 'Keyboardist', 'Bassist', 'Percussionist'];

const TIME_SLOTS = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
  '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
];

export function Reservation() {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [teamName, setTeamName] = useState('');
  const [songList, setSongList] = useState('');
  const [positions, setPositions] = useState<string[]>([]);
  const [locationId, setLocationId] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {});
  }, []);

  const togglePosition = (p: string) => {
    setPositions((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const toggleTime = (slot: string) => {
    setTimeSlots((prev) => {
      if (prev.includes(slot)) return prev.filter((s) => s !== slot);
      if (prev.length >= 2) return prev;
      return [...prev, slot].sort();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!teamName.trim()) {
      setMessage({ type: 'error', text: 'Team NAME을 입력해 주세요.' });
      return;
    }
    if (!locationId) {
      setMessage({ type: 'error', text: 'Location을 선택해 주세요.' });
      return;
    }
    if (!date) {
      setMessage({ type: 'error', text: 'Date를 선택해 주세요.' });
      return;
    }
    if (timeSlots.length === 0) {
      setMessage({ type: 'error', text: 'Time을 최대 2개까지 선택해 주세요.' });
      return;
    }
    const startTime = timeSlots[0].split('-')[0];
    const [hour, min] = startTime.split(':').map(Number);
    const performanceDatetime = new Date(date);
    performanceDatetime.setHours(hour, min, 0, 0);

    setLoading(true);
    try {
      const body: PerformanceDto = {
        performanceId: 0,
        title: teamName.trim(),
        songList: songList.trim() || undefined,
        performanceDatetime: performanceDatetime.toISOString().slice(0, 19),
        requiredPositions: positions.length ? JSON.stringify(positions) : undefined,
        status: 'SCHEDULED',
        locationId: Number(locationId),
      };
      await createPerformance(body);
      setMessage({ type: 'success', text: '예약 요청이 접수되었습니다. (로그인 시 본인 공연으로 등록됩니다)' });
      setTeamName('');
      setSongList('');
      setPositions([]);
      setLocationId('');
      setDate('');
      setTimeSlots([]);
    } catch (err) {
      const text = err instanceof Error ? err.message : '요청 실패';
      const isAuth = String(err).includes('401') || String(err).includes('403');
      setMessage({
        type: 'error',
        text: isAuth ? '로그인이 필요합니다. 로그인 후 다시 시도해 주세요.' : text,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Reservation</h1>
        <div className={styles.titleLine} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="teamName">Team NAME</label>
            <input
              id="teamName"
              type="text"
              className={styles.input}
              placeholder="팀 이름"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="songList">Song List</label>
            <input
              id="songList"
              type="text"
              className={styles.input}
              placeholder="연주 예정 곡 목록"
              value={songList}
              onChange={(e) => setSongList(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>My Position</label>
            <p className={styles.hint}>Select your main performance role.</p>
            <div className={styles.checkboxGroup}>
              {POSITIONS.map((p) => (
                <label key={p} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={positions.includes(p)}
                    onChange={() => togglePosition(p)}
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="location">Location</label>
            <p className={styles.hint}>Please refer to the &apos;Location&apos; tab for the exact location.</p>
            <select
              id="location"
              className={styles.select}
              value={locationId}
              onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Select</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.nameKo} ({loc.nameEn})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="date">Date</label>
            <p className={styles.hint}>Reservations for the following month are available during the last week of each month.</p>
            <input
              id="date"
              type="date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Time</label>
            <p className={styles.hint}>Reservations are limited to a maximum of 2 hours per day.</p>
            <div className={styles.timeGrid}>
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot}
                  className={`${styles.timeSlot} ${timeSlots.includes(slot) ? styles.selected : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={timeSlots.includes(slot)}
                    onChange={() => toggleTime(slot)}
                    disabled={timeSlots.length >= 2 && !timeSlots.includes(slot)}
                  />
                  {slot}
                </label>
              ))}
            </div>
          </div>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '처리 중...' : 'SUBMIT'}
          </button>
        </form>
      </div>
    </div>
  );
}
