import { inlineFlex, inlineGrid } from './layout.styles.js';
import { typography1, typography2, typography3 } from './typography.styles.js';

export const style1 = {
  ...typography1,
  ...inlineFlex,
  'transition + .Hook': 'all .2s ease-in-out',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  textDecoration: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  '--checkBoxFill + .hook': 'blue',
  pointerEvents: 'none',
  [`@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2)`]: {
    width: '100%',
    'backgroundColor+.Hook': 'red',
  },
};

export const testStyle2 = {
  ...typography2,
  [`@media only screen 


  and (min-device-width: 320px) 
  and (max-device-width: 480px)


  and (-webkit-min-device-pixel-ratio:    2)`]: {
    width: '100%',
    color: 'blue',
  },
};

export const testStyle3 = {
  ...inlineGrid,
  ...typography3,
  '@keyframes pulse ': {
    '0%': {
      backgroundColor: '#001f3f',
    },
    '100%': {
      backgroundColor: '#ff4136',
    },
  },
};
