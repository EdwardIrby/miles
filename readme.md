# Miles (EXPERIMENTAL)
Miles is an experimental  CSS-in-JS library. It takes a hybrid approach to CSS-in-JS.

----------
## Install

**node >= v10.13.0**
`npm install -s @dxworks/miles` 

----------
## Build

`npx miles <optional config file path>`
By default, miles will look for a config file at the root of your project called **miles.config.js**
```js
export default {
  name: / @param {string} [name='style.css'] /,
  input: / @param {string} [input='<root>/'] /,
  output: / @param {string} [output='<root>/.miles'] /,
  pattern: / @param {string} [pattern='**/*.styles.(mjs|js)'] /,
  external: / @param {array} [external=[]] /,
  resolveOptions: / @param {object} [resolveOptions={ jsnext: true, modulesOnly: true }] / ,
}
```
external: are modules you would like miles not to resolve such as react
resolveOptions: are the same as [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)

----------
## Watch 

There is no watch built into miles by default. If you want to watch and recompile CSS, below is a good approach. 

> Create a watch files
```cli
touch watch.js
```

> In the editor of your choice edit watch.js as follows
```js
const cp = require('child_process');
const chokidar = require('chokidar');

const run = scriptName => cp.spawn('npm', ['run', scriptName], { stdio: 'inherit' });

run('build-css'); 

chokidar.watch('css/**/*.styles.js').on('change', path => run('build-css'));
```

> In your package.json scripts add the following
```js
{
  "scripts": {
    "build-css": "npx miles <optional config file path>",
    "watch": "node watch.js"
  }
}
```
----------
## Use

> Create a style file (component.styles.js)
```js
const style1 = {
  'transition + .Hook': 'all .2s ease-in-out',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  textDecoration: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  [`@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2)`]: {
    width: '100%',
    'backgroundColor+.Hook': 'red',
  },
};

const typeStyle = {
  lineHeight: '28px',
  fontSize: '22px',
  fontWeight: 400,
};
```
> Basic usage in component

```jsx
import { miles, classNames } from '@dxworks/miles'
import { style1 } from './component.style.js';


export const Button = ({ children }) => (
  <button {...miles(style1) }>{ children}</button>
);
```

### Miles will return an object with two keys values pairs, className & style

```js
/**
 *  @returns {string} 'transition1872142639 whiteSpace userSelect textDecoration alignItems justifyContent width-21413265874 backgroundColor-214132658741872142639'
 * / 
```    

```js
/** @return {object} {
      '--alignItems': 'center',
      '--backgroundColor-214132658741872142639': 'red',
      '--justifyContent': 'center',
      '--textDecoration': 'none',
      '--transition1872142639': 'all .2s ease-in-out',
      '--userSelect': 'none',
      '--whiteSpace': 'nowrap',
      '--width-21413265874': '100%',
    }
 * 
 */
 ```
> Run `npx miles` to generate styles.css
```css
.alignItems{align-items:var(--alignItems)}
.fontSize{font-size:var(--fontSize)} // Not not used but generated
.fontWeight{font-weight:var(--fontWeight)} // Not not used but generated
.justifyContent{justify-content:var(--justifyContent)}
.lineHeight{line-height:var(--lineHeight)} // Not not used but generated
.textDecoration{text-decoration:var(--textDecoration)}
.transition1872142639+.Hook{transition:var(--transition1872142639)}
.userSelect{user-select:var(--userSelect)}
.whiteSpace{white-space:var(--whiteSpace)}
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2){
  .backgroundColor-214132658741872142639+.Hook{background-color:var(--backgroundColor-214132658741872142639)}
  .width-21413265874{width:var(--width-21413265874)}
}
```

> Conditionally apply styles in a component;
```jsx
import { miles, classNames } from '@dxworks/miles'
import { style1, typeStyle } from './component.style.js';

export const Button = ({ children, condition }) =>  (
  <button { ...miles(style1, condition && typeStyle) }>
    { children}
  </button>
);
```

> Destructured usage in component with pass through props
```jsx
import { miles, classNames } from '@dxworks/miles'
import { style1 } from './component.style.js';

export const Button = ({
  className,
  style,
  children
}, ref) => {
  const { className: mc, style: ms } = miles(style1);
  return (
    <button
      className={classNames( className, mc) }
      style={{ ...ms, ...style}}
    >
      { children}
    </button>
  )
};
```      
----------
## Reasoning

Miles is pretty bare bones by design.  Web applications are complex. Code style is both a personal and organizational culture decision. We don’t think there’s a perfect solution to the myriad of technical challenges we all face as developers. 

### We wanted a CSS solution that lent itself to the following:

1.  UI framework agnostic
2. Designed to work with PWA(s), not CMS(s) or Static website builders
3. Easy to maintain by keeping it minimal and simple,  due to rapidly changing dom and js standards
4. Won’t throw a fit in jest & ava
5. Shouldn’t require babel and/or a CSS pre or post processor

### To that end, we limited its functionality to:
1. Need only work in evergreen browsers
2. Uses ESM versus CJS modules
3. Generated Human readable CSS with [djb2](http://www.cse.yorku.ca/~oz/hash.html) hashes sprinkled in
4. Preserve dynamic/ad-hoc capacity via a tiny JS run-time

### This is the result of our personal beliefs and assumptions:

1. Inline styles are not inherently bad but you lose pseudo-events, pseudo-selectors, along with media queries & keyframes.
2. The cascade is our friend. We should use it, master it but not blindly slave away at it.
3. JS is essential to complex PWA(s) be they mobile or desktop, use it smartly.
4. Automation is our friend.

### Thus our solution does the following:

1. Remix a CSS concept that's been criticized by automating it and removing the need for memorization, [Functional CSS also known as Atomic CSS.](https://www.mikecr.it/ramblings/functional-css/)
2. Inlines CSS Custom Properties not values
3. Auto-generates both className (strings), inline style (object), and a css bundle from a separate *.(style|yourPrefix).(js|mjs) files written in ESM syntax with named exports and  no default.
4. Leverages the amazing [rollup.js](https://rollupjs.org/guide/en) library and evil regex too pull it all off. 


## Todo
1. minification of client-side miles module
2. considering a custom eslint plugin and vscode syntax highlighter for keys


## Notes
1. Because it’s JS you can do a lot with this and probably use it in ways we haven’t even considered. So have fun.
