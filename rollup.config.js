
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

export default {
    input: 'src/index.js',
    output: {
        file: 'lib/trezor-bridge-communicator.js',
        format: 'cjs',
    },
    plugins: [
        babel(),
        cleanup(),
    ],
};
