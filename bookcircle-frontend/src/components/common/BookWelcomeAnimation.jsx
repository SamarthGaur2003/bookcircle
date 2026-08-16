import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function BookWelcomeAnimation({ onComplete }) {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Prevent scrolling while the curtain is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  const handleAnimationComplete = () => {
    if (!isVisible && onComplete) {
      onComplete();
    }
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          className="welcome-curtain"
          initial={{ y: 0 }}
          exit={{ y: '-100dvh' }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1] // Apple-like smooth cubic-bezier
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            background: 'var(--background, #0a0a0a)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Subtle animated background glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              width: '50vw',
              height: '50vw',
              background: 'radial-gradient(circle, #00ffcc 0%, transparent 60%)',
              filter: 'blur(100px)',
              zIndex: -1
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ textAlign: 'center', padding: '0 24px' }}
          >
            <h1 style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: 800,
              margin: '0 0 1rem 0',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              color: '#fff'
            }}>
              Welcome Back<br />
              <span style={{
                background: 'linear-gradient(135deg, #00ffcc, #a67cff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {user?.name ? user.name.split(' ')[0] : 'Reader'}.
              </span>
            </h1>
            <p style={{
              color: 'var(--muted, #a1a1aa)',
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
              margin: 0,
              fontWeight: 500
            }}>
              Discover your next great read.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
