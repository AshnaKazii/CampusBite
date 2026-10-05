import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Smartphone, Coffee, CheckCircle } from 'lucide-react';

export default function Home() {
    return (
        <div className="animate-fade">
            <section style={styles.hero}>
                <h2 style={styles.college}>SHAH & ANCHOR KUTCHHI ENGINEERING COLLEGE</h2>
                <h1 style={styles.title}>LA ROCHE CAFE</h1>
                <p style={styles.subtitle}>Order Ahead. Skip the Queue. Enjoy Your Break.</p>
                <p style={styles.desc}>
                    Don't waste your break standing in line. Pre-order your food before or during your break and collect it directly from the cafe counter.
                </p>
                <div style={styles.actions}>
                    <Link to="/menu" className="btn btn-primary">ORDER NOW</Link>
                    <Link to="/menu" className="btn btn-secondary">VIEW MENU</Link>
                </div>
            </section>

            <section style={styles.howItWorks}>
                <h3 className="section-title text-center mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>HOW IT WORKS</h3>
                <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
                    {[
                        { s: '1', t: 'Choose your food', i: <Smartphone size={32} /> },
                        { s: '2', t: 'Select pickup time', i: <Clock size={32} /> },
                        { s: '3', t: 'Cafe prepares your order', i: <Coffee size={32} /> },
                        { s: '4', t: 'Collect without waiting', i: <CheckCircle size={32} /> }
                    ].map(step => (
                        <div key={step.s} style={styles.stepCard} className="card">
                            <div style={styles.iconBox}>{step.i}</div>
                            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Step {step.s}</h4>
                            <p className="text-muted">{step.t}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginTop: '4rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem' }}>Got a quick break?</h3>
                <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
                    {['5 MIN', '10 MIN', '15 MIN'].map(b => (
                        <Link to="/menu" key={b} className="card" style={styles.breakCard}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{b} BREAK</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Order now &rarr; Pick up directly</div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

const styles = {
    hero: {
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'white',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
    },
    college: { fontSize: '1rem', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: '600' },
    title: { fontSize: '4rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', lineHeight: 1 },
    subtitle: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' },
    desc: { maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem', color: 'var(--text-muted)' },
    actions: { display: 'flex', gap: '1rem', justifyContent: 'center' },
    howItWorks: { marginTop: '4rem' },
    stepCard: { padding: '2rem', textAlign: 'center', width: '220px' },
    iconBox: { color: 'var(--primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' },
    breakCard: { padding: '2rem', width: '250px', cursor: 'pointer', transition: 'transform 0.2s' }
};
