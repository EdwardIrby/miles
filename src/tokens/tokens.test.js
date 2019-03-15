import { test, assert } from '@dxworks/rite';
import { tokens } from './tokens.js';

test('tokens()', () => {
  const expected = {
    '--width': 32,
    '--height': 24,
    '--backgroundColor': 'black',
  };
  const actual = tokens(
    {
      width: 32,
      height: 24,
      backgroundColor: 'black',
    },
  );
  assert({
    given: 'object as argument',
    should: 'return object',
    actual,
    expected,
  });
});

test('tokens() conditional test', () => {
  const checked = false;
  const disabled = true;
  const expected = {
    '--width': 32,
    '--height': 24,
    '--backgroundColor': 'grey',
  };
  const actual = tokens(
    {
      width: 32,
      height: 24,
      backgroundColor: 'black',
    },
    checked && {
      backgroundColor: 'blue',
    },
    disabled && {
      backgroundColor: 'grey',
    },
  );
  assert({
    given: 'conditional arguments',
    should: 'return object',
    actual,
    expected,
  });
});
