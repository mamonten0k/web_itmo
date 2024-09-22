import typescript from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import terser from '@rollup/plugin-terser';


export default {
  input: 'server/server.ts',
  output: {
    file: 'dist/server.mjs',
    format: 'es',
  },
  external: [
    'puppeteer', 'express', 'body-parser', 'ejs',
    'node-fetch', 'lighthouse', 'chrome-launcher',
    'express-handlebars',
  ],
  plugins: [
    nodeResolve({preferBuiltins: true}),
    typescript({tsconfig: 'tsconfig.json'}),
    json(),
    commonjs(),
    terser(),
  ],
};