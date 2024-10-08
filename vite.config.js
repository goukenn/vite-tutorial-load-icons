import { defineConfig, loadEnv } from 'vite'
import path from 'path';
import fs from 'fs';
import vue from '@vitejs/plugin-vue'
import cli from 'cli-color'
import { exec } from 'child_process';

const is_prod = process.env.NODE_ENV == 'production';
const lrw = process.stdout.write;
const lew = process.stderr.write;

process.stdout.write = function (msg) {
    lrw.apply(this, [msg]);
    if (/Generated an empty chunk/.test(msg)) {
        (() => { })();
    }
};
process.stderr.write = function (msg) {
    lew.apply(this, [msg]);
    if (/Generated an empty chunk/.test(msg)) {
        let x = 9;
        (() => {
            x += 90;
        })();
    }
};


// rollup.config.js
function generateHtmlPlugin() {
    let ref1;
    return {
        name: 'generate-html',

        buildStart() {
            ref1 = this.emitFile({
                type: 'chunk',
                id: '@Lib/baba.js'
            });
        },
        resolveId(id) {
            if (id == '@Lib/baba.js') {
                return '/Volumes/Data/Documents/SfSymbols/demo-usage/src/Lib/baba.js';
            }
        },
        transform(source, file) {
            console.log('file : ', file);
            if ('/Volumes/Data/Documents/SfSymbols/demo-usage/src/Lib/baba.js' == file) {
                return source;
            }
        },
        __generateBundle() {
            if (ref1) {

                let ls = this.getFileName(ref1);
            }
            return;
            this.emitFile({
                type: 'asset',
                fileName: 'index-new.html',
                source: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Title NEw INDEX</title>
    </head>
<body>
    <script src="${ls}" type="module"> console.log(this.default) </script> 
</body>
</html>`
            });
        }
    };
}
const __baseOptions = {};

const exec_cmd = async function (cmd, option) {
    var rp = await new Promise((resolve, reject) => {
        const { controller, cwdir } = option || __baseOptions;
        const r = ['balafon'];
        r.push(cmd);
        if (controller) {
            r.push('--controller:' + controller);
        }
        if (cwdir) {
            r.push('--wdir:' + cwdir);
        }
        exec(r.join(' '), (err, stdout, stderr) => {
            if (!err) {
                return resolve(stdout);
            }
            return reject(stderr);
        })
    }).catch((e) => {
        console.log("error", e);
    });
    return rp;
};

function balafonIconLib(option) {
    const { icons } = option;
    const cmd = (() => {

        let lib = [];
        for (let i in icons) {
            let s = '';
            let l = icons[i];
            s += i + ',';
            if (Array.isArray(l)) {
                s += l.join('\\;');
            } else {
                s += l;
            }
            lib.push('--library:' + s);
        }
        return lib.length > 0 ? lib.join(' ') : null;
    })(icons)
    const ref_emits = [];
    /** @type{import('vite').Plugin}*/
    return {
        name: 'vite-plugin-balafon-libicons',

        resolveId(id) {
            if (id == 'virtual:balafon-libicons') {
                return "\0" + id;
            }
        },
        async load(id) {
            if (id == "\0virtual:balafon-libicons") {

                if (is_prod) {
                    // + | emit only work on production -
                    let src = await exec_cmd('--vue3:convert-svg-to-js-lib ' + cmd);
                    let ref1 = this.emitFile({
                        type: 'asset',
                        name: 'svg-lib.js',
                        source: src
                    })
                    ref_emits.push(ref1);
                    // let fname = this.getFileName(ref1);
                    //console.log('src', src);
                    // return { code: "export default import.meta.ROLLUP_FILE_URL_"+ref1+";", map: null }
                    // return { code: "export default (async()=>await import(import.meta.ROLLUP_FILE_URL_"+ref1+"))()", map: null }
                    // (await import(new URL("js/svg-lib.js",import.meta.url).href)).default
                    // let code = `export default (()=>import(import.meta.ROLLUP_FILE_URL_${ref1}))();`;
                    let code = `export default (()=>import(import.meta.ROLLUP_FILE_URL_${ref1}))()`;
                    return { code, map: null }
                }
                return { code: 'export default null;', map: null }
            }
        },
        // transform(src, id) {
        //     if (id == "\0virtual:balafon-libicons") {
        //         console.log("transforming lib icons ", id);
        //     }
        // },
        // renderDynamicImport(s, o) {
        //     console.log('render dynamic import', s.moduleId);
        // },
        // resolveDynamicImport(id) {
        //     console.log('resolve dynameic ', id);
        // },
        // renderStart(s, m) {
        //     console.log('render start . ')
        // },
        generateBundle(option, bundle) {
            let m = [];
            ref_emits.forEach((o)=>{
                let n = this.getFileName(o);
                n = n.replace(".","\\.");

                m.push(new RegExp(
                    '(import\\(new URL\\("'+n+'",import\\.meta\\.url\\)\\.href\\))', 'g'
                ));
    
            });  
            if (option.format == 'es') {
                for (let i in bundle) {
                    const file = bundle[i];
                    if (i.endsWith('.js') && (file.type == 'chunk')) {
                        let code = file.code;
                        if (code) {
                            m.forEach((n)=>{
                                code = code.replace(n, '(await $1).default'); 
                            });
                            file.code = code;
                        }
                    }
                }
            }
        }

    }
}


export default defineConfig({
    treeshake: false,
    plugins: [vue(), balafonIconLib(
        {
            icons: {
                'ionicons': ['/Volumes/Data/Documents/IonIcons/ionicons/src/svg', 
                    'add,accessibility,airplane,airplane-outline'],
                'sfsymbols': ['/Volumes/Data/Documents/SfSymbols/symbols',
                    'eraser,cloud.heavyrain.circle,bolt.shield.fill'
                ]
            }
        }
    )],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: "app-[name].js",
                chunkFileNames: "js/[name].js",
                assetFileNames: "[ext]/[name].[ext]"
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src'),
        },
        preserveSymlinks: true
    }
});

/*
export default defineConfig({
    server: {
        //     fs:{
        //         allow:[
        //             "/Volumes/Data/Documents/SfSymbols/"
        //         ]
        //     }
        browser: true
    },

    build: {
        sourcemap: true,
        manifest: true,
        // emptyOutDir:true,
        chunkSizeWarningLimit: 700,
        rollupOptions: {
            output: {
                entryFileNames: "app-[name].js",
                assetFileNames: "assets/[ext]/[name].[ext]",
                chunkFileNames(file) {
                    let _dir = path.dirname(file.facadeModuleId);
                    _dir = _dir.replace(new RegExp("^" + __dirname + '/src/'), "assets/js/").trimStart();

                    const rpath = _dir + "/" + path.basename(file.facadeModuleId);
                    return rpath;
                }
            }
        }
    },
    plugins: [
        vue(),

        (() => {
            let emmit = null;
            const lib_marked = {};
            const emit_list = [];

            return {
                buildStart() {
                    // emmit = this.emitFile({ 
                    //     type:"asset",
                    //     id:"\0internal:java",
                    //     name:"present.js",
                    //     // fileName:"this.is.java.js",
                    //     // fileName: "java.js",
                    //     source: "export default (()=>'re - perfectly stored.')()",
                    //     originalFileName: "bOriginale.js",
                    //     needsCodeReference: true
                    // });
                },
                resolveFileUrl(){
                    console.log("url: ");
                },
                resolveId(id, importer, ref){
                    if (id=="\0internal:java"){
                        return '_src_/file.js';
                    }
                },

                transform(src, file, importer) {
                    if (is_prod && /\/ionicons\/index.js/.test(file)) {
                        process.stdout.write('store production icons .... require symbols ');
                        lib_marked['ionicons'] = true;
                       let ref1 =  this.emitFile({
                            type:'chunk',
                            id:"src/entry3",
                            importer:file,
                            // name:'accessibility.js',
                            source: 'basic',
                            preserveSignature:true
                        });
                        emit_list.push(ref1);
                    }
                },
                generateBundle(){
                    this.emitFile({
                        'type':'asset',
                        'name':'index-icons.html',
                        'source':
`<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Title</title>
         </head>
        <body>
          <script src="${this.getFileName
(emit_list[0]
)}" type="module"></script>
        </body>
        </html>
`
                    })
                },
                load(file, cp){
                    console.log("load: "+file);
                    if ('_src_/file.js' == file){
                        const filename = this.getFileName(emmit);

                        return {
                            code: `let j = 'code of file';`//export * from "./${filename}"; `
                        }
                    } else {
                        if ('icons.js'==file){
                            // const filename = this.getFileName(emit_list[0]);

                            return  `export default (()=>'laravel')();`;

                        }
                    }
                }

            }
        })()
        // (() => {

        //     let lib_marked = {};
        //     let _gen_ref = [];
        //     return {
        //         async load(file) {
        //             console.log("\t\n" + 'loading ... ' + file);
        //             if (is_prod && /\/ionicons\/index.js/.test(file)) {
        //                 process.stdout.write('store production icons .... require symbols ');
        //             }
        //             if (file.indexOf("\0") === 0) {
        //                 // identifier detected 
        //                 file = file.substring(1);//.trimStart(); 
        //             }

        //                 if (/accessibility/.test(file)) {
        //                     console.log("----;-----", file == 'accessibility.vue', file == "\0accessibility.vue")


        //                     let src = (await fs.readFileSync('src/Lib/Icons/ionicons/icons/accessibility.vue'))+'';
        //                     let g = await this.transform(src, file);
        //                     // return src;
        //                     return {
        //                         code : src // "export default (()=>'mars')();"
        //                     }
        //                 }

        //         },

        //         transform(src, file) {
        //             if (is_prod && /\/ionicons\/index.js/.test(file)) {
        //                 process.stdout.write('store production icons .... require symbols ');
        //                 lib_marked['ionicons'] = true;
        //             }
        //         },
        //         resolveId(id) {
        //             if (/@icons:/.test(id)) {

        //                 console.log("id", id);
        //                 // return "\0" + "accessibility.vue";
        //                 return  "src/Lib/Icons/ionicons/icons/accessibility.vue";
        //             }
        //         },
        //         async buildStart(s) {
        //             console.log("build start : ",)
        //             _gen_ref.push(this.emitFile({
        //                 type: "chunk",
        //                 id: "@icons:ionicons/accessibility.vue",
        //                 //fileName: "accessibility.js",
        //                 //source:  (await fs.readFileSync('src/Lib/Icons/ionicons/icons/accessibility.vue'))+'',
        //             }));
        //         },

        //         generateBundle(s) {
        //             console.log("\n", cli.green('generateBundle'))
        //             // const file = this.getFileName(_gen_ref[0]); // .getFileName();

        //         },
        //         buildEnd() {
        //             console.log("\n", "build-end bundle ....")
        //         },
        //         closeBundle() {
        //             // 
        //             console.log("\n", "close bundle ....")
        //         },
        //         moduleParsed(e) {
        //             console.log("\n", "module parsed", cli.red(e.id))
        //         }

        //     }
        // })()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src')
        },
        preserveSymlinks: true
    }
})


*/