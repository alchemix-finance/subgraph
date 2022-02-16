import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { utils } from 'ethers';
import { JsonFragment } from '@ethersproject/abi';
import { packageRoot } from '../constants';

// TODO: Extract the start block number from the receipt
export interface ProcessedArtifact {
  absolutePath: string;
  relativePath: string;
  contractName: string;
  contractInterface: utils.Interface;
  rawJson: JsonFragment[];
  cleanedJson: JsonFragment[];
}

export const command = 'clean-abis';
export const description = 'Extracts & clean abis from the deployment output';

async function getAbis(source: string) {
  const files = glob.sync('**/*.json', {
    cwd: path.join(packageRoot, source),
    absolute: true,
  });

  const contents = await Promise.all(
    files.map<Promise<ProcessedArtifact>>(async (absolutePath) => {
      const relativePath = path.relative(packageRoot, absolutePath);
      const rawJson = (await fs.readJson(absolutePath)) as JsonFragment[];
      const contractInterface = new utils.Interface(rawJson);
      const contractName = path.basename(relativePath, '.json');

      // TODO: Remove this once graph-node support solc v0.8+ custom error types.
      // https://github.com/graphprotocol/graph-node/issues/2577
      const cleanedJson = rawJson.filter((item) => item.type !== 'error');

      return {
        absolutePath,
        relativePath,
        contractName,
        contractInterface,
        rawJson,
        cleanedJson,
      };
    }),
  );

  return contents;
}

export async function handler() {
  const extractedAbis = await getAbis('abis');
  for (const currentAbi of extractedAbis) {
    await fs.writeJson(currentAbi.absolutePath, currentAbi.cleanedJson);
  }
}
