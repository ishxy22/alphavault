import React, { useState } from 'react';
import { ChevronRight, Shield, Zap, BarChart2 } from 'lucide-react';
import { RISK_QUIZ, RISK_LABELS } from '../data/stocks';

function getRiskProfile(score) {
  if (score <= 3) return { label: 'Conservative', color: 'var(--blue)', icon: Shield, desc: 'You prefer capital safety. Low-risk, stable stocks are best..' };
  if (score <= 6) return { label: 'Moderate', color: 'var(--gold)', icon: BarChart2, desc: 'Balanced approach — seeking both growth and safety.' };
  return { label: 'Aggressive', color: 'var(--red)', icon: Zap, desc: 'You accept high risk for high returns..' };
}

export default function RiskQuiz({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (current < RISK_QUIZ.length - 1) {
      setCurrent(current + 1);
    } else {
      const avg = Math.round(newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length);
      setRiskScore(avg);
      setDone(true);
    }
  };

  const progress = ((current) / RISK_QUIZ.length) * 100;
  const profile = done ? getRiskProfile(riskScore) : null;
  const ProfileIcon = profile?.icon;

  if (done) {
    return (
      <div className="card-glow fade-up" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          background: `${profile.color}18`,
          border: `2px solid ${profile.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <ProfileIcon size={32} color={profile.color} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Your Risk Profile
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: profile.color, marginBottom: 12 }}>
          {profile.label}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 320, margin: '0 auto 8px' }}>
          {profile.desc}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 28 }}>
          Risk Score: <strong style={{ color: 'var(--text)' }}>{riskScore}/10</strong> — Max {RISK_LABELS[riskScore] || 'Medium'} stocks recommend
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onComplete(riskScore)}>
            Calculate With This Profile →
          </button>
          <button className="btn-ghost" onClick={() => { setCurrent(0); setAnswers([]); setDone(false); }}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = RISK_QUIZ[current];

  return (
    <div className="card-glow fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          Question {current + 1} of {RISK_QUIZ.length}
        </div>
        <div style={{ fontSize: 13, color: 'var(--green)' }}>
          {Math.round(progress)}% complete
        </div>
      </div>

      <div className="progress-bar" style={{ marginBottom: 28 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 28, lineHeight: 1.4 }}>
        {q.question}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt.score)}
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '14px 18px',
              color: 'var(--text)',
              fontSize: 14,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--green)';
              e.currentTarget.style.background = 'var(--green-dim)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg3)';
            }}
          >
            <span>{opt.text}</span>
            <ChevronRight size={16} color="var(--text3)" />
          </button>
        ))}
      </div>
    </div>
  );
}
