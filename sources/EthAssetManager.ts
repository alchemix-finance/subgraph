import { utils } from 'ethers';
import { eventDeclarations, deploymentAddress } from './utils/abis';
import { networkName, startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const EthAssetManagerInterface = new utils.Interface(require('../abis/EthAssetManager.json'));
const EthAssetManagerEvents = Object.values(EthAssetManagerInterface.events);

export function createEthAssetManager(
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
      file: 'subgraph/handlers/EthAssetManager.ts',
      entities: [],
      eventHandlers: eventDeclarations(EthAssetManagerEvents),
      abis: [
        {
          name: 'EthAssetManager',
          file: 'abis/EthAssetManager.json',
        },
        {
          name: 'ERC20',
          file: 'abis/ERC20.json',
        },
      ],
    },
    source: {
      abi: 'EthAssetManager',
      address,
      startBlock: startBlockNumber,
    },
  };
}
