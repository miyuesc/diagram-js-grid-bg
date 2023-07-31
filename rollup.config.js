import { defineConfig } from 'rollup';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

// 拿到package.json的name属性来动态设置打包名称
const libName = pkg.name;

export default defineConfig({
  input: 'GridLine/index.ts',
  output: [
    {
      file: `dist/${libName}.cjs.js`,
      // commonjs格式
      format: 'cjs',
    },
    {
      file: `dist/${libName}.es.js`,
      // es module
      format: 'es',
    },
    {
      file: `dist/${libName}.umd.js`,
      // 通用格式可以用于node和browser等多个场景
      format: 'umd',
      // 注意如果是umd格式的bundle的话name属性是必须的，这时可以在script标签引入后window下会挂载该属性的变量来使用你的类库方法
      name: libName,
    },
  ],
  // 解释同globals配置，这个配置的意思是我简单处理把外部依赖不打包进bundle中，而是前置引入或者作为依赖安装使用
  external: [
    'diagram-js/lib/features/grid-snapping/GridUtil',
    'diagram-js/lib/layout/LayoutUtil',
    'min-dom',
    'tiny-svg'
  ],
  plugins: [
    babel(),
    typescript({
      sourceMap: false,
    }),
    commonjs(),
    resolve(),
  ],
});
