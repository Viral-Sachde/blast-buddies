// ============================================================
// BLAST BUDDIES — SVG Icon component
// ============================================================

import React from 'react';
import Svg, {
  Circle,
  Path,
  Rect,
  Ellipse,
  G,
  Text as SvgText,
} from 'react-native-svg';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color = 'currentColor' }: IconProps) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' };

  switch (name) {
    case 'coin':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="10" fill="#ffd23f" stroke="#e0a200" strokeWidth="2.2" />
          <Circle cx="12" cy="12" r="6.4" fill="none" stroke="#e0a200" strokeWidth="1.8" />
          <SvgText x="12" y="16.2" textAnchor="middle" fontWeight="800" fontSize="9" fill="#b87b00">$</SvgText>
        </Svg>
      );
    case 'gem':
      return (
        <Svg {...props}>
          <Path d="M5 4h14l3 5-10 12L2 9z" fill="#b07cff" stroke="#7e44e0" strokeWidth="2" strokeLinejoin="round" />
          <Path d="M5 4h14l3 5H2z" fill="#cba6ff" />
          <Path d="M9 9l3 12 3-12z" fill="#e6d6ff" opacity="0.7" />
        </Svg>
      );
    case 'play':
      return (
        <Svg {...props}>
          <Path d="M7 5l13 7-13 7z" fill={color} />
        </Svg>
      );
    case 'pause':
      return (
        <Svg {...props}>
          <Rect x="6" y="5" width="4" height="14" rx="1.6" fill={color} />
          <Rect x="14" y="5" width="4" height="14" rx="1.6" fill={color} />
        </Svg>
      );
    case 'back':
      return (
        <Svg {...props}>
          <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'shop':
      return (
        <Svg {...props}>
          <Path d="M4 8h16l-1.2 11.5a1 1 0 01-1 .9H6.2a1 1 0 01-1-.9z" fill={color} />
          <Path d="M8 8V6.5a4 4 0 018 0V8" stroke={color} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </Svg>
      );
    case 'up':
      return (
        <Svg {...props}>
          <Path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6L12 16.9 6.6 19.4l1.2-6L3.3 9.3l6.1-.7z" fill={color} />
        </Svg>
      );
    case 'gear':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="3.2" fill={color} />
          <Path d="M12 2.5l1.4 2.7 3-.6.6 3 2.7 1.4-1.6 2.6 1.6 2.6-2.7 1.4-.6 3-3-.6L12 21.5l-1.4-2.7-3 .6-.6-3L4.3 15l1.6-2.6L4.3 9.8l2.7-1.4.6-3 3 .6z" fill={color} />
        </Svg>
      );
    case 'power':
      return (
        <Svg {...props}>
          <Path d="M13 2L5 13h5l-1 9 8-12h-5z" fill={color} />
        </Svg>
      );
    case 'speed':
      return (
        <Svg {...props}>
          <Path d="M4 12h9M4 7h13M4 17h7" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <Path d="M17 14l4 3-4 3z" fill={color} />
        </Svg>
      );
    case 'multi':
      return (
        <Svg {...props}>
          <Circle cx="7" cy="9" r="3.4" fill={color} />
          <Circle cx="16" cy="9" r="3.4" fill={color} opacity="0.8" />
          <Circle cx="11.5" cy="16" r="3.4" fill={color} opacity="0.6" />
        </Svg>
      );
    case 'magnet':
      return (
        <Svg {...props}>
          <Path d="M5 4h4v8a3 3 0 006 0V4h4v8a7 7 0 01-14 0z" fill={color} />
          <Rect x="5" y="3" width="4" height="3" fill="#fff" opacity="0.5" />
          <Rect x="15" y="3" width="4" height="3" fill="#fff" opacity="0.5" />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...props}>
          <Path d="M5 12l5 5 9-11" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg {...props}>
          <Rect x="5" y="10" width="14" height="10" rx="2.6" fill={color} />
          <Path d="M8 10V7.5a4 4 0 018 0V10" stroke={color} strokeWidth="2.6" fill="none" />
        </Svg>
      );
    case 'heart':
      return (
        <Svg {...props}>
          <Path d="M12 20s-7-4.6-7-9.4A3.8 3.8 0 0112 7a3.8 3.8 0 017 3.6C19 15.4 12 20 12 20z" fill={color} />
        </Svg>
      );
    case 'star':
      return (
        <Svg {...props}>
          <Path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6L12 16.9 6.6 19.4l1.2-6L3.3 9.3l6.1-.7z" fill={color} />
        </Svg>
      );
    case 'gift':
      return (
        <Svg {...props}>
          <Rect x="4" y="9" width="16" height="11" rx="2" fill={color} />
          <Rect x="3.4" y="7" width="17.2" height="4" rx="1.6" fill={color} />
          <Rect x="10.6" y="7" width="2.8" height="13" fill="#fff" opacity="0.45" />
          <Path d="M12 7c-2-3-6-1-3 1M12 7c2-3 6-1 3 1" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.55" />
        </Svg>
      );
    case 'music':
      return (
        <Svg {...props}>
          <Path d="M9 18V5l12-2v13" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="6" cy="18" r="3" fill={color} />
          <Circle cx="18" cy="16" r="3" fill={color} />
        </Svg>
      );
    case 'vibration':
      return (
        <Svg {...props}>
          <Rect x="7" y="5" width="10" height="14" rx="2" stroke={color} strokeWidth="2.2" />
          <Path d="M3 8v8M21 8v8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <Path d="M1 10v4M23 10v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg {...props}>
          <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </Svg>
      );
    case 'soundfx':
      return (
        <Svg {...props}>
          <Path d="M11 5L6 9H3v6h3l5 4V5z" fill={color} />
          <Path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </Svg>
      );
    default:
      return null;
  }
}
