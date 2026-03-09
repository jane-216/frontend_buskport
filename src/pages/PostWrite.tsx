import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPost } from '../api/posts';
import type { PostCategory } from '../types';
import styles from './PostWrite.module.css';

const CATEGORIES: PostCategory[] = ['GENERAL', 'RECRUIT', 'REVIEW'];

export function PostWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('GENERAL');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!title.trim()) {
      setMessage({ type: 'error', text: '제목을 입력해 주세요.' });
      return;
    }
    if (!content.trim()) {
      setMessage({ type: 'error', text: '내용을 입력해 주세요.' });
      return;
    }
    setLoading(true);
    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
        category,
      });
      setMessage({ type: 'success', text: '등록되었습니다.' });
      setTimeout(() => navigate('/community'), 1500);
    } catch (err) {
      const isAuth = String(err).includes('401') || String(err).includes('403');
      setMessage({
        type: 'error',
        text: isAuth ? '로그인이 필요합니다.' : (err instanceof Error ? err.message : '등록 실패'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Link to="/community" className={styles.back}>← Community</Link>
      <h1 className={styles.title}>WRITE</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">Category</label>
          <select
            id="category"
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as PostCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="content">Content</label>
          <textarea
            id="content"
            className={styles.textarea}
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
          />
        </div>
        {message && (
          <div className={message.type === 'error' ? styles.error : styles.success}>{message.text}</div>
        )}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? '등록 중...' : '등록'}
        </button>
      </form>
    </div>
  );
}
