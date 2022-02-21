import { utils } from 'ethers';
import { eventDeclaration, deploymentAddress } from './utils/abis';
import { startBlockNumber } from './utils/constants';
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
    network: 'testnet',
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
      ],
    },
    source: {
      abi: 'Alchemist',
      address,
      startBlock: block,
    },
  };
}
