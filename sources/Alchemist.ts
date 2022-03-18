import { utils } from 'ethers';
import { eventDeclaration, deploymentAddress } from './utils/abis';
import { networkName, startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const AlchemistInterface = new utils.Interface(require('../abis/Alchemist.json'));
const AlchemistEvents = Object.values(AlchemistInterface.events);

export function createAlchemist(
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
      file: 'subgraph/handlers/Alchemist.ts',
      entities: [],
      eventHandlers: AlchemistEvents.map((fragment) => eventDeclaration(fragment)),
      abis: [
        {
          name: 'Alchemist',
          file: 'abis/Alchemist.json',
        },
        {
          name: 'ERC20',
          file: 'abis/ERC20.json',
        },
      ],
    },
    source: {
      abi: 'Alchemist',
      address,
      startBlock: block,
    },
  };
}
