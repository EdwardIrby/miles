import { describe } from '@dxworks/rite';
import { tokens } from './tokens';

describe('tokens()', assert => {
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

describe('tokens() conditional test', assert => {
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
