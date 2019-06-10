import { describe } from '@dxworks/rite';
import { classNames } from './classNames';

describe('classNames()', assert => {
  assert({
    given: 'two string',
    should: 'return properly concatenated string',
    actual: classNames('class-1', 'class-2'),
    expected: 'class-1 class-2',
  });

  const condtionTrue = true;
  const conditionFalse = false;
  assert({
    given: 'two conditionals and a string',
    should: 'return properly concatenated string',
    actual: classNames('class-1', conditionFalse && 'class-2', condtionTrue && 'class-3'),
    expected: 'class-1 class-3',
  });
});
