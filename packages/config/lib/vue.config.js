import { VantResolver } from 'unplugin-vue-components/resolvers'
import ComponentsPlugin from 'unplugin-vue-components/webpack'
import AutoImport from 'unplugin-vue-components/webpack'
import VConsolePlugin from 'vconsole-webpack-plugin'
import postcssConvert from 'postcss-px-to-viewport-8-plugin'
import autoprefixer from 'autoprefixer'

const env = process.env.envMode || process.env.NODE_ENV;

const chainWebpack = config => {
    // vue 框架相关 单独打包
    const isVendorChunk = chunk => {
        const dependencies = ['/vue/', '/@vue/'];
        return /node_modules/.test(chunk.resource) && dependencies.some(key => chunk.resource.includes(key));
    };

    config.optimization.splitChunks({
        automaticNameDelimiter: '-',
        cacheGroups: {
            vendor: {
                name: 'chunk-vendors',
                test: chunk => {
                    return isVendorChunk(chunk);
                },
                chunks: 'all',
                enforce: true,
            },
        },
    });

    // 定义常量
    config.plugin('define').tap((definitions) => {
        Object.assign(definitions[0]['process.env'], {
            // 'NODE_ENV': JSON.stringify(env),全局变量
            BAS_AD: 3
        });
        return definitions;
    });

};

const configureWebpack = config => {
    config.plugins.push(
        //vant按需引入
        ComponentsPlugin({ resolvers: [VantResolver()] }),
    )
    // vue api自动导入
    config.plugins.push(
        AutoImport({
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/ // .vue
            ],
            // 自动导入的库
            imports: ['vue'],
            eslintrc: {
                enabled: true, // Default `false`
                filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
                globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
            // 声明文件生成位置和文件名称
            dts: './auto-imports.d.ts'
        })
    )

    // vant按需引入
    config.plugins.push(
        ComponentsPlugin({
            resolvers: [VantResolver()]
        })
    )
    // 测试环境注入console
    if (env !== 'production') {
        config.plugins.push(
            new VConsolePlugin({
                enable: true
            })
        );
    }
    //如果是线上静态文件上传cdn
    // if (env === 'production') {
    //     config.plugins.push(new UploadOssPlugin());
    // }

}

export default {
    crossorigin: 'anonymous',
    // 发布文件路径
    publicPath: env === 'production' ? '//res-static.inframe.mobi/user' : '/',
    //去掉map
    productionSourceMap: false,
    css: {
        loaderOptions: {
            postcss: {
                postcssOptions: {
                    plugins: [
                        autoprefixer,
                        postcssConvert({
                            unitToConvert: 'px', // 需要转换的单位，默认为"px"
                            viewportWidth: 375, //  设计稿的视口宽度
                            unitPrecision: 5, // 单位转换后保留的精度
                            propList: ['*'], // 能转化为vw的属性列表
                            viewportUnit: 'vw', //  希望使用的视口单位
                            fontViewportUnit: 'vw', // 字体使用的视口单位
                            selectorBlackList: ['.ignore', '.hairlines', '.ig-'], // 需要忽略的CSS选择器
                            minPixelValue: 0.01, // 最小的转换数值，如果为1的话，只有大于1的值会被转换
                            mediaQuery: false, // 媒体查询里的单位是否需要转换单位
                            replace: true, // 是否直接更换属性值，而不添加备用属性
                            landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
                            landscapeUnit: 'vw', // 横屏时使用的单位
                            landscapeWidth: 568 // 横屏时使用的视口宽度
                        }),
                    ],
                }
            },
        },
    },
    chainWebpack,
    configureWebpack,
    // 开发环境配置
    // devServer: {
    //     // open: true, // 启动完成自动在浏览器中打开项目
    //     // 设置代理，用来解决本地开发跨域问题
    //     proxy: {
    //         '/api': {
    //             target: 'https://app.inframe.mobi'
    //         },
    //         '/v1/partyroom': {
    //             target: 'http://test.game.inframe.mobi',
    //             changeOrigin: true,
    //             hostRewrite: true,
    //             autoRewrite: true
    //         },
    //         '/v1/game': {
    //             target: 'http://test.game.inframe.mobi',
    //             changeOrigin: true,
    //             hostRewrite: true,
    //             autoRewrite: true
    //         },
    //         '/v1/users': {
    //             target: 'http://test.kconf.inframe.mobi',
    //             changeOrigin: true,
    //             hostRewrite: true,
    //             autoRewrite: true
    //         },
    //         '/v2': {
    //             target: 'http://test.api.inframe.mobi',
    //             changeOrigin: true,
    //             hostRewrite: true,
    //             autoRewrite: true
    //         },
    //         '/v3': {
    //             target: 'http://test.api.inframe.mobi',
    //             changeOrigin: true,
    //             hostRewrite: true,
    //             autoRewrite: true
    //         }
    //     }
    // }
}

export {
    chainWebpack,
    configureWebpack
};