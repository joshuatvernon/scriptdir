import commander from 'commander';

const defaultExpectedArgs = 3;

// Parse program arguments
export default (command: commander.Command, args: string[], expectedNumArgs?: number): void => {
  if (args.length < (expectedNumArgs ? expectedNumArgs : defaultExpectedArgs)) {
    // No program arguments were passed; display help and exit
    command.help();
  }
  // Arguments were passed; parse program arguments
  command.parse(args);
};
