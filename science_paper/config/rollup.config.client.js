import typescript from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';


export default {
  input: 'client/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
  },
  context: 'globalThis',
  plugins: [
    nodeResolve({preferBuiltins: true}),
    typescript({tsconfig: 'tsconfig.json'}),
    json(),
    commonjs(),
    terser(),
    copy({targets: [
        {src: `client/index.html`, dest: `dist/views`},
    ]}),  
  ],
};