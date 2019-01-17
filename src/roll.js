import Module from 'module';
import resolve from 'rollup-plugin-node-resolve';

const { rollup } = require('rollup');

const requireFromString = code => {
  const m = new Module();
  m._compile(code, '');
  return m.exports;
};

export const roll = async ({ filePath, external }) => {
  const bundle = await rollup({
    input: filePath,
    external,
    plugins: [
      resolve({
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
  // console.log(output.output[0].code)
  return requireFromString(output.output[0].code);
};
