/* eslint-disable no-console */

import {
  removeWhiteSpace,
  camelCaseToDash,
  hashString,
} from '@dxworks/utils';

import {
  formatAtRule,
  camelCaseRegex,
  keyframesStepRegex,
  atKeyframesRegex,
  atMediaRegex,
  createCustomProp,
  atRuleCustomProp,
  customPropRegex,
} from './utils.js';

import { roll } from './roll.js';

const utilityKeys = new Set();
const utilityMap = new Map();
const atKeyframesKeys = new Set();
const atKeyframesMap = new Map();
const atMediaKeys = new Set();
const atMediaMap = new Map();

const handleRuleSets = rule => {
  const key = removeWhiteSpace(rule);
  const [, prop, rest] = key.match(camelCaseRegex);
  const setUtility = uk => {
    utilityKeys.add(uk);
    !utilityMap.has(uk) && utilityMap.set(
      uk,
      `.${
        [
          prop,
          rest && hashString(rest),
          rest,
        ].join('')}{${camelCaseToDash(prop)}:var(--${createCustomProp(prop, rest)})}`,
    );
  };
  setUtility(key);
};

const handleSteps = ({ styles, filePath }) => Object.entries(styles)
  .filter(([prop]) => {
    const cased = camelCaseRegex.test(prop);

    !cased && console.log(
      '\x1b[33m%s\x1b[0m',
      `Please camelCase css rule set in keyframes: Prop(${prop}) File(${filePath})`,
    );

    return cased;
  })
  .map(([prop, value]) => `    ${camelCaseToDash(prop)}:${value};`)
  .join('\n');

const handleKeyframesRules = ({ rule, value, filePath }) => {
  const keyframesRule = formatAtRule(rule);
  const template = Object.entries(value)
    .filter(([step]) => {
      !keyframesStepRegex.test(step) && console.log(
        '\x1b[33m%s\x1b[0m',
        `Invalid Keyframe(${step}) File(${filePath})`,
      );

      return keyframesStepRegex.test(step);
    })
    .reduce((acc, [step, styles]) => {
      acc.push([`  ${step}{`, handleSteps({ styles, filePath }), '  }'].join('\n'));
      return acc;
    }, [])
    .join('\n');
  atKeyframesKeys.add(keyframesRule);
  atKeyframesMap.has(keyframesRule)
    ? atKeyframesMap.get(keyframesRule).add(template)
    : atKeyframesMap.set(keyframesRule, new Set([template]));
};

const handleAtMedia = ({ rule, value, filePath }) => {
  const atRule = formatAtRule(rule);
  Object.keys(value)
    .filter(prop => {
      const cased = camelCaseRegex.test(prop);

      !cased && console.log(
        '\x1b[33m%s\x1b[0m',
        `Please camelCase css rule set in ${atRule}: Prop(${prop}) File(${filePath})`,
      );
      /* eslint-disable enable */
      return cased;
    })
    .map(style => {
      const key = removeWhiteSpace(style);
      const [, prop, rest] = key.match(camelCaseRegex);
      const customProp = atRuleCustomProp(prop, atRule, rest);
      return `  .${
        [customProp, rest].join('')
      }{${camelCaseToDash(prop)}:var(--${customProp})}`;
    })
    .forEach(template => {
      atMediaKeys.add(atRule);
      atMediaMap.has(atRule)
        ? atMediaMap.get(atRule).add(template)
        : atMediaMap.set(atRule, new Set([template]));
    });
};

const handleCustomProp = rule => {
  const key = removeWhiteSpace(rule);
  const [, marker, prop, rest] = key.match(customPropRegex);
  const setUtility = uk => {
    utilityKeys.add(uk);
    !utilityMap.has(uk) && utilityMap.set(
      uk,
      `.${
        [
          marker,
          prop,
          rest && hashString(rest),
          rest,
        ].join('')}{${marker}${prop}:var(${marker}${createCustomProp(prop, rest)})}`,
    );
  };
  setUtility(key);
};

const sortStyleKeys = ({ styles, filePath }) => Object.values(styles)
  .map(style => Object.entries(style))
  .reduce((acc, cur) => acc.concat(cur), [])
  .forEach(
    ([rule, value]) => (camelCaseRegex.test(rule)
      ? handleRuleSets(rule)
      : atKeyframesRegex.test(rule)
      ? handleKeyframesRules({ rule, value, filePath })
      : atMediaRegex.test(rule)
      ? handleAtMedia({ rule, value, filePath })
      : customPropRegex.test(rule)
      ? handleCustomProp(rule)
      : console.log(
        '\x1b[33m%s\x1b[0m',
        `Miles does not support Rule(${rule}) File(${filePath})`,
      )

    ),
  );

/* eslint-disable consistent-return */


export const generate = async ({ files, external }) => {
  try {
    await Promise.all(files.map(async filePath => {
      const styles = await roll({
        filePath,
        external,
      });
      sortStyleKeys({
        styles,
        filePath,
      });
    }));
    const ruleSets = [...utilityKeys]
      .map(key => utilityMap.get(key))
      .sort();
    const atRules = [...atMediaKeys].map(key => [
      `${key}{`,
      [...atMediaMap.get(key)]
        .sort()
        .join('\n'),
      '}',
    ].join('\n'));
    const keyframesRules = [...atKeyframesKeys].map(key => [
      `${key}{`,
      [...atKeyframesMap.get(key)]
        .sort()
        .join('\n'),
      '}',
    ].join('\n'));
    const css = [...ruleSets, ...atRules, ...keyframesRules].join('\n');
    return css;
  } catch (err) {
    console.log(err);
  }
};
