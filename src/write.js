/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import * as constants from './constants.js';
import { generate } from './generate.js';
import { roll } from './roll.js';

const defaultConfig = path.resolve(process.cwd(), './miles.config.js');

export const write = async (config = defaultConfig) => {
  const filePath = path.resolve(process.cwd(), config);
  const milesConfig = await roll({
    filePath,
  });
  const {
    name = constants.name,
    pattern = constants.pattern,
    input = constants.input,
    output = constants.output,
    external = constants.external,
  } = milesConfig;
  const inputGlobPattern = path.resolve(process.cwd(), `${input}/${pattern}`);

  const files = await fg(inputGlobPattern);
  const css = await generate({ files, external });
  const outputPath = path.resolve(process.cwd(), `${output}`);
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFile(`${outputPath}/${name}.css`, css, err => {
    if (err) throw err;
  });
  console.log(`${name}.css done!!`);
};
