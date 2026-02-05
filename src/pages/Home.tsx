import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export function Home() {
  return (
    <div className={styles.hero}>
      <img 
        src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=2070" 
        alt="Buskport Hero" 
        className={styles.heroImage} 
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>BUSKPORT</h1>
        <p className={styles.subtitle}>
          Connecting talented street artists with audiences worldwide. 
          Discover performances and book your spot today.
        </p>
        <Link to="/schedule" className={styles.cta}>Explore Schedule</Link>
      </div>
    </div>
  );
}
