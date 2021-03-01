#!/usr/bin/env node
/** @format */

const { Command } = require('commander');
const packageJson = require('../package.json');
const chalk = require('chalk');

console.log(
  chalk.hex('#00BF8A')('-= Sensors Extendable Frontend =-'),
  chalk.hex('#307EF2')('v' + packageJson.version)
);

const program = new Command('format')
  .version(packageJson.version)
  .command('build', 'build project', { executableFile: 'shortcuts/build' })
  .command('serve', 'start dev-server for project', { executableFile: 'shortcuts/serve' })
  .command('init [folder]', 'init project with template ', { executableFile: 'template/init' })

  .command('module [command]', 'build/serve/publish/install module', {
    executableFile: 'module/index'
  })
  .command('component [command]', 'build/serve/publish component', {
    executableFile: 'component/index'
  })
  .command('app [command]', 'build/serve module', { executableFile: 'app/index' })
  .command('template [command]', 'init/update template', { executableFile: 'template/index' })
  .command('intl [command]', 'export/import/build intl', { executableFile: 'module/index' })

  .command('login', 'login to Jfrog', { executableFile: 'config/login' })
  .command('config [command]', 'toolchain config', { executableFile: 'config/index' });

program.parse(process.argv);
