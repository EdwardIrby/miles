# Miles (EXPERIMENTAL)
Miles is an experimental  CSS-in-JS library. It takes a hybrid approach to CSS-in-JS. It is design to be used in conjunction with css-modules. It makes use of css custom properties to allow for the dynamic updating of css values and sharing of values between components in the light-dom. Miles consist of two simple utility functions with a very small runtime footprint, **classNames*, and ***tokens**.

----------
## Install

`npm install -s @dxworks/miles` 

----------
## usage

### classNames
#### Simple Example
**component.js**
```js
import { classNames } from '@dxworks/miles';
import styles from 'Component.css';

<div className={
 classNames(
   className, // pass through className prop
   style.example,
 ) }
/>
```

**Component.css**
```css
.example{
  /* your example class styles here */
}
```

#### Conditional Example
**component.js**
```js
import { classNames } from '@dxworks/miles';
import styles from 'Component.css';

<div className={
 classNames(
   className, // pass through className prop
   styles.example,
   condition && styles.conditionalClass
 ) }
/>
```

**Component.css**
```css
.example{
  /* your example class styles here */
}

.conditionalClass {
   /* your conditional class styles here */
}
```

### tokens

#### Simple Example
**Component.js**
```jsx
import { tokens } from '@dxworks/miles';

<span className='example' style={tokens({
   lineHeight: 1.2,
   fontSize: 47.78,
   randomColor: 'blue',
})} />
```
**Component.css**
```css
.example{
  line-height: var(--lineHeight);
  font-size: var(--fontSize);
  color: var(--randomColor);
}
```
### Conditional Example
**Component.js**
```jsx
import { tokens } from '@dxworks/miles';

<span className='example' style={tokens(
 inline ? { display: 'inline' } : { display: 'block' },
 {
   lineHeight: 1.2,
   fontSize: 47.78,
 },
)} />
```
**Component.css**
```css
.example{
  display: var(--display);
  line-height: var(--lineHeight);
  font-size: var(--fontSize);
}
```