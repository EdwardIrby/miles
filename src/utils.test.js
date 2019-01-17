import test from 'ava';

import {
  classNames,
  createCustomProp,
} from './utils.js';

test('classNames util function', t => {
  const truthy = true;
  const result = classNames(truthy);
  t.is(result, 'true');

  const falsey = false || truthy;
  const result2 = classNames(falsey);
  t.is(result2, 'true');

  const checkMe = (truthy ? 'im working' : 'im not working');
  const result3 = classNames(truthy, falsey, 'hello', checkMe);
  t.is(result3, 'true true hello im working');
});


test('createCustomProp function', t => {
  const simple1 = createCustomProp('marginRight');
  const simple2 = createCustomProp('paddingRight');
  const complex1 = createCustomProp('fill', ":checked[data-indeterminate='false']+.Icon");
  const complex2 = createCustomProp('pointerEvents', "[data-previous-month='true']+.Label");
  t.deepEqual(simple1, 'marginRight');
  t.deepEqual(simple2, 'paddingRight');
  t.deepEqual(complex1, 'fill-13248418906');
  t.deepEqual(complex2, 'pointerEvents-2869536168');
});
