import React from 'react';
import { Box } from '@mui/material';

export default function LoadingSpinner({ size = 64 }) {
  // colorful rotating ring made with CSS and an inner dot
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          position: 'relative',
          // multi-layer radial gradient ring
          background: 'conic-gradient(from 0deg, #6C5CE7, #00B894, #FFD166, #FF6B6B, #6C5CE7)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
          animation: 'spin 1.2s linear infinite',
          '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        }}
      />
      {/* small inner dot for depth */}
      <Box
        sx={{
          position: 'absolute',
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6))',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}
      />
    </Box>
  );
}
