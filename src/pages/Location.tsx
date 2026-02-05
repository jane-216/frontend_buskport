import { useState, useEffect } from 'react';
import { getLocations } from '../api/locations';
import type { LocationDto } from '../types';
import styles from './Location.module.css';

export function Location() {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [selected, setSelected] = useState<LocationDto | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? locations.filter(
        (loc) =>
          loc.nameEn.toLowerCase().includes(search.toLowerCase()) ||
          loc.nameKo.includes(search) ||
          (loc.address && loc.address.toLowerCase().includes(search.toLowerCase()))
      )
    : locations;

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.mapSection}>
        <div className={styles.mapPlaceholder}>
          지도 (카카오/네이버 맵 API 연동 시 좌표로 표시)
        </div>
        {selected && (
          <div className={styles.infoCard}>
            <div className={styles.infoCardTitle}>{selected.nameKo}</div>
            <div className={styles.infoCardAddr}>{selected.address}</div>
            {selected.rating != null && (
              <div className={styles.infoCardRating}>
                {selected.rating} ★ {selected.reviewCount != null && `${selected.reviewCount.toLocaleString()}개 리뷰`}
              </div>
            )}
            <div className={styles.infoCardLinks}>
              <a href={`https://map.kakao.com/?q=${encodeURIComponent(selected.address)}`} target="_blank" rel="noreferrer">
                큰 지도 보기
              </a>
              <a href={`https://map.kakao.com/?q=${encodeURIComponent(selected.address)}`} target="_blank" rel="noreferrer">
                길찾기
              </a>
            </div>
          </div>
        )}
      </div>

      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Find a BuskPort</h2>
        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Enter Location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className={styles.searchBtn}>Search</button>
        </div>
        <div className={styles.locationList}>
          {filtered.map((loc) => (
            <div
              key={loc.locationId}
              role="button"
              tabIndex={0}
              className={`${styles.locationCard} ${selected?.locationId === loc.locationId ? styles.active : ''}`}
              onClick={() => setSelected(loc)}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(loc)}
            >
              <div className={styles.locationCardName}>{loc.nameKo} ({loc.nameEn})</div>
              <div className={styles.locationCardAddr}>{loc.addressEng || loc.address}</div>
              <div className={styles.locationCardSub}>BuskPort {loc.sortOrder ?? loc.locationId}</div>
            </div>
          ))}
        </div>
        <div className={styles.scrollHint}>↑ 더 많은 장소</div>
      </aside>
    </div>
  );
}
