import {
  removeWhiteSpace,
} from '@dxworks/utils';

import {
  classNames,
  camelCaseRegex,
  atMediaRegex,
  customPropRegex,
  createCustomProp,
  atRuleCustomProp,
  formatAtRule,
} from './utils.js';

const handleRuleSets = (rule, value) => {
  const key = removeWhiteSpace(rule);
  const [, prop, rest] = key.match(camelCaseRegex);
  const cls = createCustomProp(prop, rest);
  const customProps = { [`--${cls}`]: value };
  return { cls, customProps };
};

const handleAtMedia = (rule, value) => {
  const atRule = formatAtRule(rule);
  const { className, customProps } = Object.entries(value)
    .reduce(
      (acc, [key, style]) => {
        const [, prop, rest] = key.match(camelCaseRegex);
        const cls = atRuleCustomProp(prop, atRule, rest);
        acc.className.add(cls);
        Object.assign(acc.customProps, { [`--${cls}`]: style });
        return acc;
      },
      { className: new Set(), customProps: {} },
    );
  return { cls: classNames(...className), customProps };
};

const handleCustomProp = (rule, value) => {
  const key = removeWhiteSpace(rule);
  const [, marker, prop, rest] = key.match(customPropRegex);
  const cls = `${marker}${createCustomProp(prop, rest)}`;
  const customProps = { [`${cls}`]: value };
  return { cls, customProps };
};

export const miles = (...styles) => {
  // Need to fix for when this is undefined;
  const { className, style } = styles
    .filter(Boolean)
    .reduce((acc, cur) => [...acc, ...Object.entries(cur)], [])
    .map(([rule, value]) => (
            camelCaseRegex.test(rule)
              ? handleRuleSets(rule, value)
              : atMediaRegex.test(rule)
              ? handleAtMedia(rule, value)
              : customPropRegex.test(rule)
              ? handleCustomProp(rule, value)
              : {}
    ))
    .reduce(
      (acc, { cls, customProps }) => {
        cls && acc.className.add(cls);
        Object.assign(acc.style, customProps);
        return acc;
      },
      { className: new Set(), style: {} },
    );
  return { className: classNames(...className), style };
};

export { classNames };
