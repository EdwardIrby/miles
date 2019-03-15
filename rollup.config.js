/* eslint-disable import/no-default-export */
import path from 'path';

export default {
  input: path.resolve(__dirname, './src/miles.js'),
  output: {
    file: path.resolve(__dirname, './dist/miles.js'),
    format: 'cjs',
  },
};
