import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../api/client';
import styles from './Login.module.css';

export function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!userId || !password) {
      setError('ID와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await apiPost('/auth/login', { userId, password });
      // API가 성공하면 쿠키에 토큰이 저장되므로, 로컬 스토리지에 로그인 상태 표시
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError('로그인에 실패했습니다. ID나 비밀번호를 확인해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>LOGIN</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="userId" className={styles.label}>ID</label>
            <input
              id="userId"
              type="text"
              className={styles.input}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Your ID"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className={styles.signupLink}>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
