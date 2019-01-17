import test from 'ava';
import { miles } from './client.js';

const style1 = {
  'transition + .Hook': 'all .2s ease-in-out',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  textDecoration: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  '--checkBoxFill + .hook': 'blue',
  [`@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2)`]: {
    width: '100%',
    'backgroundColor+.Hook': 'red',
  },
};

const typeStyle = {
  lineHeight: '28px',
  fontSize: '22px',
  fontWeight: 400,
};

test('miles false condtional arg', t => {
  const typography = false;
  const { className, style } = miles(style1, typography && typeStyle);
  t.snapshot(className, 'classNames typography false');
  t.snapshot(style, 'style typography false');
});

test('miles true condtional arg', t => {
  const typography = true;
  const { className, style } = miles(style1, typography && typeStyle);
  t.snapshot(className, 'classNames typography true');
  t.snapshot(style, 'style typography true');
});
