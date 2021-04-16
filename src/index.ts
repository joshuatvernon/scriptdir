#!/usr/bin/env node

import commander from 'commander';

import version from '../version';
import { commands } from './commands';
import { config } from './config';
import { constants } from './constants';

// "add" command
const addRepoCommand = new commander.Command();
addRepoCommand.name('add');
addRepoCommand.description('Add script');
addRepoCommand.usage('[options]');
addRepoCommand.option('-n, --name <repoName>', 'Name of repo to add');
addRepoCommand.option('-u, --url <repoUrl>', 'Url of repo to add');
addRepoCommand.option('-p, --path <path>', 'Path to repo to add');
addRepoCommand.option('-f, --force', 'Force add');
addRepoCommand.option('-s, --silent', 'Silent add');
addRepoCommand.action((options: commander.OptionValues) => {
  if (options.name && options.url) {
    commands.add(options.name, options.url, undefined, options.force, options.silent);
  } else if (options.name && options.path) {
    commands.add(options.name, undefined, options.path, options.force, options.silent);
  } else {
    addRepoCommand.help();
  }
});

// "remove" command
const removeRepoCommand = new commander.Command();
removeRepoCommand.name('remove');
removeRepoCommand.description('Remove script');
removeRepoCommand.usage('[options]');
removeRepoCommand.option('-n, --name [repoName]', 'Name of repo to remove');
removeRepoCommand.option('-f, --force', 'Force remove');
removeRepoCommand.action((options: commander.OptionValues) => {
  commands.remove(options.name, options.force);
});

// "update" command
const updateRepoCommand = new commander.Command();
updateRepoCommand.name('update');
updateRepoCommand.description('Update scripts');
updateRepoCommand.usage('[options]');
updateRepoCommand.option('-n, --name [repoName]', 'Name of repo to update');
updateRepoCommand.option('-f, --force', 'Force update');
updateRepoCommand.option('-s, --silent', 'Silent update');
updateRepoCommand.action((options: commander.OptionValues) => {
  commands.update(options.name, options.force, options.silent);
});

// "execute" command
const executeRepoCommand = new commander.Command();
executeRepoCommand.name('execute');
executeRepoCommand.description('Execute scripts');
executeRepoCommand.usage('[options]');
executeRepoCommand.option('-n, --name [repoName]', 'Name of repo to update');
executeRepoCommand.option('-v, --verbose', 'Run in verbose mode');
executeRepoCommand.action((options: commander.OptionValues) => {
  commands.execute(options.name, options.verbose);
});

// "list" command
const listRepoCommand = new commander.Command();
listRepoCommand.name('list');
listRepoCommand.description('List scripts');
listRepoCommand.action(commands.list);

// main command
commander.name(constants.programName);
commander.version(version);
commander.description('Add, update and run scripts from git repos');
commander.usage('[options]');
commander.addCommand(addRepoCommand);
commander.addCommand(removeRepoCommand);
commander.addCommand(updateRepoCommand);
commander.addCommand(executeRepoCommand);
commander.addCommand(listRepoCommand);

// load config, parse args and run relevant commands
config.load();
const noArgsPassed = process.argv.length < 3;
const onlyVerboseArgPassed = process.argv.length === 3 && (process.argv[2] === '-v' || process.argv[2] === '--verbose');
if (noArgsPassed || onlyVerboseArgPassed) {
  if (config.repos.length === 0) {
    commander.help();
  } else {
    if (onlyVerboseArgPassed) {
      commands.execute(undefined, true);
    } else {
      commands.execute();
    }
  }
} else {
  commander.parse();
}
