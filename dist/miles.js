'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @param {...{}} objs - object containing camelCased
 * style properties or css custom properties
 * @returns {<{'--prop': 'value'}>} containing prefixed css
 *  custom properties to be inlined.
 * @example Simple
 * <Textblock style={tokens({
*    lineHeight: 1.2,
*    fontSize: rem(47.78),
*  })} />
 * @example Conditional Example
 * <Textblock style={tokens(
 *  inline ? { display: 'inline' } : { display: 'block' },
 *  {
 *    lineHeight: 1.2,
 *    fontSize: rem(47.78),
 *  },
 * )} />
 */
const tokens = (...objs) => objs
  .filter(Boolean)
  .map(obj => Object.entries(obj))
  .reduce((acc, cur) => acc.concat(cur), [])
  .reduce((acc, [key, value]) => ({ ...acc, [`--${key}`]: value }), {});

/**
 * @description A module that takes n string arguments that contain class names for a node and then concatenates them.
 * @param  {...string} classes
 * @return a single string connected with a space
 * @example Simple
 * <div className={
 *  classNames(
 *    className, // pass through className prop
 *    iconStyles.MyClass,
 *  ) }
 * />
 *  @example Conditional
 * <div className={
 *  classNames(
 *    className, // pass through className prop
 *    styles.MyClass,
 *    condition && styles.ConditionalClass
 *  ) }
 * />
 */
const classNames = (...classes) => classes.filter(Boolean).join(' ');

exports.tokens = tokens;
exports.classNames = classNames;
