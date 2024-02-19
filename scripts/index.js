const { program } = require('commander');
const chalk = require('chalk');
const { build } = require('./build');

program
    .version('0.0.1')
    .option('-p, --p <project>', '要build的project name')
    .option('-a, --all', '全量build')
    .option('-local, --local', '是否是本地build')
    .parse(process.argv);

const opts = program.opts();

const ensureTarget = () => {
    if (!opts.p && !opts.all) {
        const msg = '\n必须传入 --p=<project> 参数\n';
        console.log(chalk.red(msg));
        throw new Error(msg);
    }
};

const parseActions = async action => {
    switch (action) {
        case 'new': {
            inquire();
            break;
        }
        case 'serve': {
            ensureTarget();
            serve(opts);
            break;
        }
        case 'build': {
            ensureTarget();
            build(opts);
            break;
        }
        case 'clean': {
            clean();
            break;
        }
        default: break;
    }
};

program
    .command('build')
    .description('build pages')
    .action(() => {
        parseActions('build');
    });


program.parse();
