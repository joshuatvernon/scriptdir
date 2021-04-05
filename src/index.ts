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
addRepoCommand.action((options: commander.OptionValues) => {
  if (options.name && options.url) {
    commands.add(options.name, options.url);
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
removeRepoCommand.option('-f, --force', '');
removeRepoCommand.action((options: commander.OptionValues) => {
  commands.remove(options.name, options.force);
});

// "update" command
const updateRepoCommand = new commander.Command();
updateRepoCommand.name('update');
updateRepoCommand.description('Update scripts');
updateRepoCommand.usage('[options]');
updateRepoCommand.option('-n, --name [repoName]', 'Name of repo to update');
updateRepoCommand.option('-f, --force', '');
updateRepoCommand.action((options: commander.OptionValues) => {
  commands.update(options.name, options.force);
});

// "execute" command
const executeRepoCommand = new commander.Command();
executeRepoCommand.name('execute');
executeRepoCommand.description('Execute scripts');
executeRepoCommand.usage('[options]');
executeRepoCommand.option('-n, --name [repoName]', 'Name of repo to update');
executeRepoCommand.option('-v, --verbose', 'Print scipt execution command');
executeRepoCommand.action((options: commander.OptionValues) => {
  commands.execute(options.name, options.verbose);
});

// "list" command
const listRepoCommand = new commander.Command();
listRepoCommand.name('list');
listRepoCommand.description('List scripts');
listRepoCommand.action(commands.list);

// root command
commander.name(constants.programName);
commander.version(version);
commander.description('Add, update and run scripts from git repos');
commander.usage('[options]');
commander.addCommand(addRepoCommand);
commander.addCommand(removeRepoCommand);
commander.addCommand(updateRepoCommand);
commander.addCommand(executeRepoCommand);
commander.addCommand(listRepoCommand);

config.load();
if (process.argv.length < 3) {
  if (config.repos.length === 0) {
    commander.help();
  } else {
    commands.execute();
  }
} else {
  commander.parse();
}
