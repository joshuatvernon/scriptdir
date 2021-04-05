import commander from 'commander';

// Set command description
export default (
  command: commander.Command,
  version: string,
  name: string,
  description: string,
  usage?: string
): void => {
  // Set command version
  command.version(version);
  // Set command name
  command.name(name);
  // Set command description
  command.description(description);
  // Set command usage
  command.usage(usage ? usage : '[options]');
};
