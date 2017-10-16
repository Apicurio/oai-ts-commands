
export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/OAI-commands.umd.js',
    format: 'umd',
    moduleName: 'OAI_commands',
    external: [ "oai-ts-core" ],
    globals: {
        "oai-ts-core": "OAI"
    }
};
