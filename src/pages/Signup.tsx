import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../api/client';
import styles from './Signup.module.css';

export function Signup() {
  const [formData, setSignupData] = useState({
    userId: '',
    password: '',
    nickname: '',
    phoneNumber: '',
    activityRegion: '',
    preferredGenres: '',
    position: 'Vocalist', // 기본값
    introduction: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.userId || !formData.password || !formData.nickname) {
      setError('필수 항목(ID, 비밀번호, 닉네임)을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 백엔드 사양에 맞춰 데이터 전송 (UserCreateRequestDto)
      await apiPost('/users/regist', {
        socialId: formData.userId, // 기존 백엔드 필드 대응
        socialProvider: 'LOCAL',
        password: formData.password,
        nickname: formData.nickname,
        phoneNumber: formData.phoneNumber,
        activityRegion: formData.activityRegion,
        preferredGenres: formData.preferredGenres,
        position: formData.position,
        introduction: formData.introduction
      });
      
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.signupBox}>
        <h1 className={styles.title}>SIGN UP</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>ID *</label>
            <input name="userId" type="text" className={styles.input} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password *</label>
            <input name="password" type="password" className={styles.input} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Nickname *</label>
            <input name="nickname" type="text" className={styles.input} onChange={handleChange} required />
          </div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Position</label>
              <select name="position" className={styles.select} onChange={handleChange}>
                <option value="Vocalist">Vocalist</option>
                <option value="Guitarist">Guitarist</option>
                <option value="Keyboardist">Keyboardist</option>
                <option value="Bassist">Bassist</option>
                <option value="Percussionist">Percussionist</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input name="phoneNumber" type="text" className={styles.input} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Introduction</label>
            <textarea name="introduction" className={styles.textarea} onChange={handleChange} rows={3}></textarea>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Register Now'}
          </button>
          <p className={styles.loginLink}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
