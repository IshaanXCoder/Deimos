// phone.jsx — themed phone frame
// Simple Android-ish bezel that adapts to the active theme's bg/text colors.

const Phone = ({ children, theme, onBack, title, statusTextColor, bezelColor }) => {
  const W = 390, H = 844;
  const bezel = bezelColor || '#0c0c0d';
  const statusC = statusTextColor || theme.text;

  return (
    <div style={{
      width: W + 14, height: H + 14,
      background: bezel,
      borderRadius: 52,
      padding: 7,
      boxShadow: '0 40px 80px -20px rgba(0,0,0,0.45), 0 0 0 2px rgba(255,255,255,0.04) inset',
      position: 'relative',
    }}>
      <div style={{
        width: W, height: H,
        background: theme.bg,
        borderRadius: 46,
        overflow: 'hidden',
        position: 'relative',
        color: theme.text,
      }}>
        {/* Status bar */}
        <div style={{
          height: 44, padding: '0 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 14, fontWeight: 600,
          color: statusC,
          position: 'relative', zIndex: 2,
        }}>
          <span>10:17</span>
          <span style={{display:'flex',gap:4,alignItems:'center'}}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 10.5L1 3.5a9.9 9.9 0 0114 0L8 10.5z" fill={statusC}/></svg>
            <svg width="14" height="10" viewBox="0 0 14 10" fill={statusC}><rect x="0" y="6" width="2" height="4"/><rect x="3" y="4" width="2" height="6"/><rect x="6" y="2" width="2" height="8"/><rect x="9" y="0" width="2" height="10"/></svg>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke={statusC}/>
              <rect x="2" y="2" width="15" height="7" rx="1" fill={statusC}/>
              <rect x="19" y="3.5" width="2" height="4" rx="0.5" fill={statusC}/>
            </svg>
          </span>
        </div>
        {/* Camera punch-hole */}
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 22, height: 22, borderRadius: '50%', background: '#000',
          zIndex: 3,
        }} />
        {/* Content */}
        <div style={{
          height: H - 44 - 24, overflow: 'hidden',
          position: 'relative',
        }}>
          {children}
        </div>
        {/* Gesture nav */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 128, height: 4, borderRadius: 2,
            background: theme.text, opacity: 0.6,
          }}/>
        </div>
      </div>
    </div>
  );
};

window.Phone = Phone;
