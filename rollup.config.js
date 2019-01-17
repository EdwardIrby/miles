/* eslint-disable import/no-default-export */
import path from 'path';
import cleanup from 'rollup-plugin-cleanup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: [
    path.resolve(__dirname, './src/client.js'),
    path.resolve(__dirname, './src/cli.js'),
  ],
  external: ['@dxworks/utils'],
  output: {
    dir: path.resolve(__dirname, './dist'),
    format: 'cjs',
  },
  plugins: [
    cleanup({
      comments: 'none',
    }),
    resolve({
      modulesOnly: true,
    }),
    commonjs(),
  ],
};
