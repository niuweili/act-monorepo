const { PROJECT_ROOT } = require('./config')
const shell = require('shelljs');

function buildPages(opts) {
    let command = 'build';
    if (opts.local) {
        command = 'build:local';
    }

    // if (!opts.all && !ALL_PAGES_WORKSPACE.some(work => work.name === opts.p)) {
    //     console.log(chalk.red('[Error] invalid package name, please check!'));
    //     shell.exit(1);
    // }
    const pCmd = opts.p ? `-p ${opts.p}` : '';
    const buildRes = shell.exec(`npx wsrun -m ${pCmd} -r --stages ${command}`, {
        cwd: PROJECT_ROOT,
    });

    if (buildRes.code !== 0) {
        console.log(chalk.red('[Error] Build failed!'));
        shell.exit(1);
    }

}
function build(opts) {
    console.log('opts-->', opts)
    buildPages(opts)
}

module.exports = {
    build
}