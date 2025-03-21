import {nodeResolve} from '@rollup/plugin-node-resolve'

const external = [/@aws-sdk.*/,  /lodash.*/, /recursive-readdir/, /cdnizer/, /progress/]
const input = 'src/s3_plugin.js'
const plugins = [nodeResolve()]

export default [
  {
    external,
    input,
    output: {
      file:'dist/s3_plugin.cjs',
      format: 'cjs',
    },
    plugins,
  },
  {
    external,
    input,
    output: {
      file:'dist/s3_plugin.mjs',
      format: 'esm',
    },
    plugins,
  },
]
