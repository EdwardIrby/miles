import { write } from './write.js';

const [, , config] = process.argv;
write(config);
