'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils = require('@dxworks/utils');
var __chunk_1 = require('./chunk-fa287951.js');

const handleRuleSets = (rule, value) => {
  const key = utils.removeWhiteSpace(rule);
  const [, prop, rest] = key.match(__chunk_1.camelCaseRegex);
  const cls = __chunk_1.createCustomProp(prop, rest);
  const customProps = { [`--${cls}`]: value };
  return { cls, customProps };
};
const handleAtMedia = (rule, value) => {
  const atRule = __chunk_1.formatAtRule(rule);
  const { className, customProps } = Object.entries(value)
    .reduce(
      (acc, [key, style]) => {
        const [, prop, rest] = key.match(__chunk_1.camelCaseRegex);
        const cls = __chunk_1.atRuleCustomProp(prop, atRule, rest);
        acc.className.add(cls);
        Object.assign(acc.customProps, { [`--${cls}`]: style });
        return acc;
      },
      { className: new Set(), customProps: {} },
    );
  return { cls: __chunk_1.classNames(...className), customProps };
};
const handleCustomProp = (rule, value) => {
  const key = utils.removeWhiteSpace(rule);
  const [, marker, prop, rest] = key.match(__chunk_1.customPropRegex);
  const cls = `${marker}${__chunk_1.createCustomProp(prop, rest)}`;
  const customProps = { [`${cls}`]: value };
  return { cls, customProps };
};
const miles = (...styles) => {
  const { className, style } = styles
    .filter(Boolean)
    .reduce((acc, cur) => [...acc, ...Object.entries(cur)], [])
    .map(([rule, value]) => (
            __chunk_1.camelCaseRegex.test(rule)
              ? handleRuleSets(rule, value)
              : __chunk_1.atMediaRegex.test(rule)
              ? handleAtMedia(rule, value)
              : __chunk_1.customPropRegex.test(rule)
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
  return { className: __chunk_1.classNames(...className), style };
};

exports.classNames = __chunk_1.classNames;
exports.miles = miles;
