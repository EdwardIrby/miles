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
export const classNames = (...classes) => classes.filter(Boolean).join(' ');
