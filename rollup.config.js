import css from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy';

import archiver from 'archiver';
import Fs from 'fs';

import PKG from './package.json';

const SRC_DIR  = './src';
const DIST_DIR = './bundle';
const ZIP_BUNDLE = './bundle.zip';

/************************
* Build script plugins
************************/
function zipper(src, dest) {
    return {
        name: 'zipper-plugin',
        writeBundle(...args) {
            const ws = Fs.createWriteStream(dest);
            const arch = archiver('zip');
            
            arch.pipe(ws);
            arch.directory(src);
            arch.finalize();
        }
    };
};

/************************
* Build script utilities
************************/
const toSrcDir  = relPath => `${SRC_DIR}/${relPath}`;
const toDistDir = (relPath = null) => relPath == null ? DIST_DIR :`${DIST_DIR}/${relPath}`;


/************************
* Main configuration
************************/
const mainConfig = {
    "input": toSrcDir("assets/main.js"),
    "output": {
        "file": toDistDir("assets/main.js"),
        "format": "iife"
    },
    "plugins": [
        css({ extract: true, minimize: false }),
        copy({
            targets: [
                // Copy assets to bundle folder
                { src: toSrcDir('assets/images/*'), dest: toDistDir('assets/images') },
                { src: toSrcDir('assets/fonts/*'),  dest: toDistDir('assets/fonts')  },
                
                // Copy templates to bundle folder
                { src: toSrcDir('templates/*'),     dest: toDistDir()               },
                { src: toSrcDir('partials'),        dest: toDistDir()               },

                { src: 'package.json',              dest: toDistDir()               },
            ]
        }),
        zipper(toDistDir(), `./${PKG.name}.zip`)
    ]
};


export default [ mainConfig ];