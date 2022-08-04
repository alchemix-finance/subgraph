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

// NOTE: These are partial legacy contract interfaces that have been deprecated but still need to be considered for historical blocks.
const legacy: Record<string, utils.Interface> = {
  Alchemist: new utils.Interface([
    `event Liquidate(address indexed owner, address indexed yieldToken, uint256 shares)`,
    `event Repay(address indexed sender, address indexed underlyingToken, uint256 amount, address recipient)`,
    `event Liquidate(address indexed owner, address indexed yieldToken, address indexed underlyingToken, uint256 shares)`,
    `event Harvest(address indexed yieldToken, uint256 minimumAmountOut, uint256 totalHarvested)`,
  ]),
};

async function getAbis() {
  const artifacts = {
    Alchemist: path.resolve(packageRoot, 'deployments/mainnet/AlchemistV2_alUSD.json'),
    Transmuter: path.resolve(packageRoot, 'deployments/mainnet/TransmuterV2_DAI.json'),
    TransmuterBuffer: path.resolve(packageRoot, 'deployments/mainnet/TransmuterBuffer_alUSD.json'),
  } as const;

  const contents = await Promise.all(
    Object.entries(artifacts).map<Promise<ProcessedArtifact>>(async ([contractName, sourcePath]) => {
      // NOTE: We put the legacy abis before the current abis to incrementally add numerical suffixes over time. Otherwise, every change
      // in a event or call signature would require a refactor to existing code.
      const legacyAbi = JSON.parse((legacy[contractName]?.format(utils.FormatTypes.json) as string) ?? '[]');
      const currentAbi = (await fs.readJson(sourcePath)).abi as JsonFragment[];
      const rawJson = [...legacyAbi, ...currentAbi];

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
