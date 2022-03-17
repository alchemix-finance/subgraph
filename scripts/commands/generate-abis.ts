import fs from 'fs-extra';
import path from 'path';
import { utils } from 'ethers';
import { JsonFragment } from '@ethersproject/abi';
import { packageRoot } from '../constants';

export interface ProcessedArtifact {
  sourcePath: string;
  destinationPath: string;
  contractName: string;
  contractInterface: utils.Interface;
  rawJson: JsonFragment[];
  cleanedJson: JsonFragment[];
}

export const command = 'generate-abis';
export const description = 'Extracts & clean abis from the deployment output';

async function getAbis() {
  const artifacts = {
    Alchemist: path.resolve(packageRoot, 'v2-contracts/deployments/mainnet/AlchemistV2_alETH.json'),
    Transmuter: path.resolve(packageRoot, 'v2-contracts/deployments/mainnet/TransmuterV2_ETH.json'),
    TransmuterBuffer: path.resolve(packageRoot, 'v2-contracts/deployments/mainnet/TransmuterBuffer_alETH.json'),
  } as const;

  const contents = await Promise.all(
    Object.entries(artifacts).map<Promise<ProcessedArtifact>>(async ([contractName, sourcePath]) => {
      const rawJson = (await fs.readJson(sourcePath)).abi as JsonFragment[];
      const destinationPath = path.resolve(packageRoot, 'abis', `${contractName}.json`);
      const contractInterface = new utils.Interface(rawJson);

      // TODO: Remove this once graph-node support solc v0.8+ custom error types.
      // https://github.com/graphprotocol/graph-node/issues/2577
      const cleanedJson = rawJson.filter((item) => item.type !== 'error');

      return {
        sourcePath,
        destinationPath,
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
  const extractedAbis = await getAbis();
  for (const currentAbi of extractedAbis) {
    await fs.outputJson(currentAbi.destinationPath, currentAbi.cleanedJson);
  }
}
