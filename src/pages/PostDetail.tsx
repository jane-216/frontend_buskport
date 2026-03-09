import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '../api/posts';
import type { PostDto } from '../types';
import styles from './PostDetail.module.css';

export function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    getPost(Number(postId))
      .then(setPost)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!post) return <div className={styles.error}>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.page}>
      <Link to="/community" className={styles.back}>← Community</Link>
      <article className={styles.article}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          {post.authorName ?? `User ${post.userId}`} · {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
        </div>
        <div className={styles.content}>{post.content}</div>
      </article>
    </div>
  );
}
