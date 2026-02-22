import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/posts';
import type { PostDto } from '../types';
import type { PostCategory } from '../types';
import styles from './Community.module.css';

const TABS: { key: PostCategory; label: string }[] = [
  { key: 'GENERAL', label: 'General' },
  { key: 'RECRUIT', label: 'Recruit' },
  { key: 'REVIEW', label: 'Review' },
];

export function Community() {
  const [category, setCategory] = useState<PostCategory>('GENERAL');
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPosts(category)
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  const filtered = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.trim().toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.content && p.content.toLowerCase().includes(q)) ||
        (p.authorName && p.authorName.toLowerCase().includes(q))
    );
  }, [posts, search]);

  if (loading && posts.length === 0) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`${styles.tab} ${category === key ? styles.active : ''}`}
            onClick={() => {
              setCategory(key);
              setLoading(true);
              setError(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <select
          className={styles.filterSelect}
          value="ALL"
          onChange={() => {}}
          aria-label="필터"
        >
          <option value="ALL">ALL</option>
        </select>
        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className={styles.searchBtn} aria-label="검색">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
      </div>

      <div className={styles.postList}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>게시글이 없습니다.</div>
        ) : (
          filtered.map((post) => (
            <Link key={post.postId} to={`/community/${post.postId}`} className={styles.postItem}>
              <span className={styles.postTitle}>{post.title}</span>
              <span className={styles.postAuthor}>{post.authorName ?? `User ${post.userId}`}</span>
            </Link>
          ))
        )}
      </div>

      <div className={styles.writeRow}>
        <Link to="/community/write" className={styles.writeBtn}>
          WRITE
        </Link>
      </div>
    </div>
  );
}
