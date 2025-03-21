import {default as esbuild} from 'esbuild'
import {nodeExternalsPlugin} from 'esbuild-node-externals'
import {rm} from 'fs/promises'

try {
  // Delete the dist directory before building
  await rm('./dist', {recursive: true, force: true})
} catch (error) {
  // Ignore errors if directory doesn't exist
  if (error.code !== 'ENOENT') {
    // eslint-disable-next-line no-console
    console.error('Error cleaning up build files:', error)
  }
}

const opts = {
  entryPoints:['./src/s3_plugin.js'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  plugins: [nodeExternalsPlugin({
    allowList: [/mime.*/]
  })],
}

const builds = [
  {
    outfile: 'dist/s3_plugin.cjs',
    format: 'cjs',
  },
  {
    outfile: 'dist/s3_plugin.mjs',
    format: 'esm',
  }
]

for (const build of builds) {
  esbuild.build({
    ...opts,
    ...build
  }).catch(() => process.exit(1))
}
