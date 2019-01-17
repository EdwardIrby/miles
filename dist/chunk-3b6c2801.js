'use strict';

var utils = require('@dxworks/utils');

const atKeyframesRegex = /^(@keyframes)(.*)/;
const atMediaRegex = /^(@media)(.*)/;
const formatAtRule = rule => {
  const regex1 = /\s\s+|\n+/g;
  const regex2 = /\s$/;
  return rule
    .replace(regex1, ' ')
    .replace(regex2, '');
};
const camelCaseRegex = /^([a-z][A-Za-z]*)(.*)/;
const customPropRegex = /^(--)([A-Za-z][A-Za-z]*)(.*)/;
const keyframesStepRegex = /^(from|to|[0-9][0-9%-]*)(.*)/;
const createCustomProp = (prop, rest) => [prop, rest && utils.hashString(rest)].join('');
const atRuleCustomProp = (
  prop,
  atRule,
  rest,
) => [prop, utils.hashString(utils.removeWhiteSpace(atRule)), rest && utils.hashString(rest)].join('');
const classNames = (...classes) => classes.filter(Boolean).join(' ');

exports.camelCaseRegex = camelCaseRegex;
exports.atMediaRegex = atMediaRegex;
exports.classNames = classNames;
exports.customPropRegex = customPropRegex;
exports.createCustomProp = createCustomProp;
exports.formatAtRule = formatAtRule;
exports.atRuleCustomProp = atRuleCustomProp;
exports.atKeyframesRegex = atKeyframesRegex;
exports.keyframesStepRegex = keyframesStepRegex;
