/* eslint-disable no-console */
const { mkdirSync, writeFile } = require('fs');
const path = require('path');
require('@zeit/ncc')('@dxworks/miles/dist/cli.js', {
  // provide a custom cache path or disable caching
  cache: false,
  // externals to leave as requires of the build
  minify: false, // default
  sourceMap: false, // default
  watch: false // default
}).then(({ code, map, assets }) => {
  mkdirSync(path.resolve(__dirname, 'bin'), { recursive: true });
  writeFile(path.resolve(__dirname, 'bin/miles.js'), code, err => {
    if (err) throw err;
  });
});
