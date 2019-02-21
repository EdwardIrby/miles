'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var utils = require('@dxworks/utils');
var __chunk_1 = require('./chunk-3088c3a2.js');
var fs = _interopDefault(require('fs'));
var path = require('path');
var path__default = _interopDefault(path);
var fg = _interopDefault(require('fast-glob'));
var Module = _interopDefault(require('module'));
var builtins = _interopDefault(require('builtin-modules'));
var resolveId = _interopDefault(require('resolve'));
var isModule = _interopDefault(require('is-module'));

const name = 'styles';
const pattern = '**/*.styles.(mjs|js)';
const input = '';
const output = '/.miles';
const external = [];

var ES6_BROWSER_EMPTY = path.resolve( __dirname, '../src/empty.js' );
var DEFAULT_EXTS = [ '.mjs', '.js', '.json', '.node' ];
var readFileCache = {};
var readFileAsync = function (file) { return new Promise(function (fulfil, reject) { return fs.readFile(file, function (err, contents) { return err ? reject(err) : fulfil(contents); }); }); };
var statAsync = function (file) { return new Promise(function (fulfil, reject) { return fs.stat(file, function (err, contents) { return err ? reject(err) : fulfil(contents); }); }); };
function cachedReadFile (file, cb) {
	if (file in readFileCache === false) {
		readFileCache[file] = readFileAsync(file).catch(function (err) {
			delete readFileCache[file];
			throw err;
		});
	}
	readFileCache[file].then(function (contents) { return cb(null, contents); }, cb);
}
var isFileCache = {};
function cachedIsFile (file, cb) {
	if (file in isFileCache === false) {
		isFileCache[file] = statAsync(file)
			.then(
				function (stat) { return stat.isFile(); },
				function (err) {
					if (err.code == 'ENOENT') { return false; }
					delete isFileCache[file];
					throw err;
				});
	}
	isFileCache[file].then(function (contents) { return cb(null, contents); }, cb);
}
var resolveIdAsync = function (file, opts) { return new Promise(function (fulfil, reject) { return resolveId(file, opts, function (err, contents) { return err ? reject(err) : fulfil(contents); }); }); };
function nodeResolve ( options ) {
	if ( options === void 0 ) options = {};
	var useModule = options.module !== false;
	var useMain = options.main !== false;
	var useJsnext = options.jsnext === true;
	var isPreferBuiltinsSet = options.preferBuiltins === true || options.preferBuiltins === false;
	var preferBuiltins = isPreferBuiltinsSet ? options.preferBuiltins : true;
	var customResolveOptions = options.customResolveOptions || {};
	var jail = options.jail;
	var only = Array.isArray(options.only)
		? options.only.map(function (o) { return o instanceof RegExp
			? o
			: new RegExp('^' + String(o).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&') + '$'); }
		)
		: null;
	var browserMapCache = {};
	if ( options.skip ) {
		throw new Error( 'options.skip is no longer supported — you should use the main Rollup `external` option instead' );
	}
	if ( !useModule && !useMain && !useJsnext ) {
		throw new Error( "At least one of options.module, options.main or options.jsnext must be true" );
	}
	var preserveSymlinks;
	return {
		name: 'node-resolve',
		options: function options ( options$1 ) {
			preserveSymlinks = options$1.preserveSymlinks;
		},
		generateBundle: function generateBundle () {
			isFileCache = {};
			readFileCache = {};
		},
		resolveId: function resolveId$$1 ( importee, importer ) {
			var this$1 = this;
			if ( /\0/.test( importee ) ) { return null; }
			var basedir = importer ? path.dirname( importer ) : process.cwd();
			if (options.browser && browserMapCache[importer]) {
				var resolvedImportee = path.resolve( basedir, importee );
				var browser = browserMapCache[importer];
				if (browser[importee] === false || browser[resolvedImportee] === false) {
					return ES6_BROWSER_EMPTY;
				}
				if (browser[importee] || browser[resolvedImportee] || browser[resolvedImportee + '.js'] || browser[resolvedImportee + '.json']) {
					importee = browser[importee] || browser[resolvedImportee] || browser[resolvedImportee + '.js'] || browser[resolvedImportee + '.json'];
				}
			}
			var parts = importee.split( /[/\\]/ );
			var id = parts.shift();
			if ( id[0] === '@' && parts.length ) {
				id += "/" + (parts.shift());
			} else if ( id[0] === '.' ) {
				id = path.resolve( basedir, importee );
			}
			if (only && !only.some(function (pattern) { return pattern.test(id); })) { return null; }
			var disregardResult = false;
			var packageBrowserField = false;
			var extensions = options.extensions || DEFAULT_EXTS;
			var resolveOptions = {
				basedir: basedir,
				packageFilter: function packageFilter ( pkg, pkgPath ) {
					var pkgRoot = path.dirname( pkgPath );
					if (options.browser && typeof pkg[ 'browser' ] === 'object') {
						packageBrowserField = Object.keys(pkg[ 'browser' ]).reduce(function (browser, key) {
							var resolved = pkg[ 'browser' ][ key ] === false ? false : path.resolve( pkgRoot, pkg[ 'browser' ][ key ] );
							browser[ key ] = resolved;
							if ( key[0] === '.' ) {
								var absoluteKey = path.resolve( pkgRoot, key );
								browser[ absoluteKey ] = resolved;
								if ( !path.extname(key) ) {
									extensions.reduce( function ( browser, ext ) {
										browser[ absoluteKey + ext ] = browser[ key ];
										return browser;
									}, browser );
								}
							}
							return browser;
						}, {});
					}
					if (options.browser && typeof pkg[ 'browser' ] === 'string') {
						pkg[ 'main' ] = pkg[ 'browser' ];
					} else if ( useModule && pkg[ 'module' ] ) {
						pkg[ 'main' ] = pkg[ 'module' ];
					} else if ( useJsnext && pkg[ 'jsnext:main' ] ) {
						pkg[ 'main' ] = pkg[ 'jsnext:main' ];
					} else if ( ( useJsnext || useModule ) && !useMain ) {
						disregardResult = true;
					}
					return pkg;
				},
				readFile: cachedReadFile,
				isFile: cachedIsFile,
				extensions: extensions
			};
			if (preserveSymlinks !== undefined) {
				resolveOptions.preserveSymlinks = preserveSymlinks;
			}
			return resolveIdAsync(
				importee,
				Object.assign( resolveOptions, customResolveOptions )
			)
				.catch(function () { return false; })
				.then(function (resolved) {
					if (options.browser && packageBrowserField) {
						if (packageBrowserField[ resolved ]) {
							resolved = packageBrowserField[ resolved ];
						}
						browserMapCache[resolved] = packageBrowserField;
					}
					if ( !disregardResult && resolved !== false ) {
						if ( !preserveSymlinks && resolved && fs.existsSync( resolved ) ) {
							resolved = fs.realpathSync( resolved );
						}
						if ( ~builtins.indexOf( resolved ) ) {
							return null;
						} else if ( ~builtins.indexOf( importee ) && preferBuiltins ) {
							if ( !isPreferBuiltinsSet ) {
								this$1.warn(
									"preferring built-in module '" + importee + "' over local alternative " +
									"at '" + resolved + "', pass 'preferBuiltins: false' to disable this " +
									"behavior or 'preferBuiltins: true' to disable this warning"
								);
							}
							return null;
						} else if ( jail && resolved.indexOf( path.normalize( jail.trim( path.sep ) ) ) !== 0 ) {
							return null;
						}
					}
					if ( resolved && options.modulesOnly ) {
						return readFileAsync( resolved, 'utf-8').then(function (code) { return isModule( code ) ? resolved : null; });
					} else {
						return resolved === false ? null : resolved;
					}
				});
		}
	};
}

const { rollup } = require('rollup');
const requireFromString = code => {
  const m = new Module();
  m._compile(code, '');
  return m.exports;
};
const roll = async ({ filePath, external }) => {
  const bundle = await rollup({
    input: filePath,
    external,
    plugins: [
      nodeResolve({
        jsnext: true,
        modulesOnly: true,
      }),
    ],
    treeshake: {
      pureExternalModules: true,
    },
  });
  const output = await bundle.generate({
    format: 'cjs',
    exports: 'named',
  });
  return requireFromString(output.output[0].code);
};

const utilityKeys = new Set();
const utilityMap = new Map();
const atKeyframesKeys = new Set();
const atKeyframesMap = new Map();
const atMediaKeys = new Set();
const atMediaMap = new Map();
const handleRuleSets = rule => {
  const key = utils.removeWhiteSpace(rule);
  const [, prop, rest] = key.match(__chunk_1.camelCaseRegex);
  const setUtility = uk => {
    utilityKeys.add(uk);
    !utilityMap.has(uk) && utilityMap.set(
      uk,
      `.${
        [
          prop,
          rest && utils.hashString(rest),
          rest,
        ].join('')}{${utils.camelCaseToDash(prop)}:var(--${__chunk_1.createCustomProp(prop, rest)})}`,
    );
  };
  setUtility(key);
};
const handleSteps = ({ styles, filePath }) => Object.entries(styles)
  .filter(([prop]) => {
    const cased = __chunk_1.camelCaseRegex.test(prop);
    !cased && console.log(
      '\x1b[33m%s\x1b[0m',
      `Please camelCase css rule set in keyframes: Prop(${prop}) File(${filePath})`,
    );
    return cased;
  })
  .map(([prop, value]) => `    ${utils.camelCaseToDash(prop)}:${value};`)
  .join('\n');
const handleKeyframesRules = ({ rule, value, filePath }) => {
  const keyframesRule = __chunk_1.formatAtRule(rule);
  const template = Object.entries(value)
    .filter(([step]) => {
      !__chunk_1.keyframesStepRegex.test(step) && console.log(
        '\x1b[33m%s\x1b[0m',
        `Invalid Keyframe(${step}) File(${filePath})`,
      );
      return __chunk_1.keyframesStepRegex.test(step);
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
  const atRule = __chunk_1.formatAtRule(rule);
  Object.keys(value)
    .filter(prop => {
      const cased = __chunk_1.camelCaseRegex.test(prop);
      !cased && console.log(
        '\x1b[33m%s\x1b[0m',
        `Please camelCase css rule set in ${atRule}: Prop(${prop}) File(${filePath})`,
      );
      return cased;
    })
    .map(style => {
      const key = utils.removeWhiteSpace(style);
      const [, prop, rest] = key.match(__chunk_1.camelCaseRegex);
      const customProp = __chunk_1.atRuleCustomProp(prop, atRule, rest);
      return `  .${
        [customProp, rest].join('')
      }{${utils.camelCaseToDash(prop)}:var(--${customProp})}`;
    })
    .forEach(template => {
      atMediaKeys.add(atRule);
      atMediaMap.has(atRule)
        ? atMediaMap.get(atRule).add(template)
        : atMediaMap.set(atRule, new Set([template]));
    });
};
const handleCustomProp = rule => {
  const key = utils.removeWhiteSpace(rule);
  const [, marker, prop, rest] = key.match(__chunk_1.customPropRegex);
  const setUtility = uk => {
    utilityKeys.add(uk);
    !utilityMap.has(uk) && utilityMap.set(
      uk,
      `.${
        [
          marker,
          prop,
          rest && utils.hashString(rest),
          rest,
        ].join('')}{${marker}${prop}:var(${marker}${__chunk_1.createCustomProp(prop, rest)})}`,
    );
  };
  setUtility(key);
};
const sortStyleKeys = ({ styles, filePath }) => Object.values(styles)
  .map(style => Object.entries(style))
  .reduce((acc, cur) => acc.concat(cur), [])
  .forEach(
    ([rule, value]) => (__chunk_1.camelCaseRegex.test(rule)
      ? handleRuleSets(rule)
      : __chunk_1.atKeyframesRegex.test(rule)
      ? handleKeyframesRules({ rule, value, filePath })
      : __chunk_1.atMediaRegex.test(rule)
      ? handleAtMedia({ rule, value, filePath })
      : __chunk_1.customPropRegex.test(rule)
      ? handleCustomProp(rule)
      : console.log(
        '\x1b[33m%s\x1b[0m',
        `Miles does not support Rule(${rule}) File(${filePath})`,
      )
    ),
  );
const generate = async ({ files, external }) => {
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

const defaultConfig = path__default.resolve(process.cwd(), './miles.config.js');
const write = async (config = defaultConfig) => {
  const filePath = path__default.resolve(process.cwd(), config);
  const milesConfig = await roll({
    filePath,
  });
  const {
    name: name$1 = name,
    pattern: pattern$1 = pattern,
    input: input$1 = input,
    output: output$1 = output,
    external: external$1 = external,
  } = milesConfig;
  const inputGlobPattern = path__default.resolve(process.cwd(), `${input$1}/${pattern$1}`);
  const files = await fg(inputGlobPattern);
  const css = await generate({ files, external: external$1 });
  const outputPath = path__default.resolve(process.cwd(), `${output$1}`);
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFile(`${outputPath}/${name$1}.css`, css, err => {
    if (err) throw err;
  });
  console.log(`${name$1}.css done!!`);
};

const [, , config] = process.argv;
write(config);
