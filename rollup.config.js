
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import json from 'rollup-plugin-json';

export default {
    input: 'src/index.js',
    output: {
        file: 'lib/index.js',
        format: 'cjs',
    },
    plugins: [
        json(),
        babel(),
        cleanup(),
    ],
};
