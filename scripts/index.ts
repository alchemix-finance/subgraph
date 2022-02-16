import path from 'path';
import yargs from 'yargs';
import { utils } from 'ethers';

// For some reason, ethers.js emits logs on its own without exposing a properly configurable logger interface.
utils.Logger.setLogLevel(utils.Logger.levels.OFF);

const extension = path.extname(__filename).slice(1);

export const args = yargs
  .env('ALCHEMIX')
  .commandDir('commands', { extensions: [extension] })
  .demandCommand(1)
  .strictCommands()
  .parse();
