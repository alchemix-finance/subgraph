import { utils } from 'ethers';
import { eventDeclarations, deploymentAddress } from './utils/abis';
import { networkName, startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const ThreePoolAssetManagerInterface = new utils.Interface(require('../abis/ThreePoolAssetManager.json'));
const ThreePoolAssetManagerEvents = Object.values(ThreePoolAssetManagerInterface.events);

export function createThreePoolAssetManager(
  name: string,
  block: number = startBlockNumber,
  address: string = deploymentAddress(name),
): DataSource {
  return {
    name,
    network: networkName,
    kind: 'ethereum/contract',
    mapping: {
      apiVersion: '0.0.6',
      kind: 'ethereum/events',
      language: 'wasm/assemblyscript',
      file: 'subgraph/handlers/ThreePoolAssetManager.ts',
      entities: [],
      eventHandlers: eventDeclarations(ThreePoolAssetManagerEvents),
      abis: [
        {
          name: 'ThreePoolAssetManager',
          file: 'abis/ThreePoolAssetManager.json',
        },
        {
          name: 'ERC20',
          file: 'abis/ERC20.json',
        },
      ],
    },
    source: {
      abi: 'ThreePoolAssetManager',
      address,
      startBlock: 14265505,
    },
  };
}
