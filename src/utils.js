import {
  removeWhiteSpace,
  hashString,
} from '@dxworks/utils';

export const atKeyframesRegex = /^(@keyframes)(.*)/;

export const atMediaRegex = /^(@media)(.*)/;

export const formatAtRule = rule => {
  const regex1 = /\s\s+|\n+/g;
  const regex2 = /\s$/;
  return rule
    .replace(regex1, ' ')
    .replace(regex2, '');
};
export const startsWithAtRegex = /^@/;
export const camelCaseRegex = /^([a-z][A-Za-z]*)(.*)/;
export const customPropRegex = /^(--)([A-Za-z][A-Za-z]*)(.*)/;
export const keyframesStepRegex = /^(from|to|[0-9][0-9%-]*)(.*)/;

export const createCustomProp = (prop, rest) => [prop, rest && hashString(rest)].join('');

export const atRuleCustomProp = (
  prop,
  atRule,
  rest,
) => [prop, hashString(removeWhiteSpace(atRule)), rest && hashString(rest)].join('');

export const classNames = (...classes) => classes.filter(Boolean).join(' ');
