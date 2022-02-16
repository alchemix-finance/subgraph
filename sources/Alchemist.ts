import { utils } from 'ethers';
import { eventDeclaration } from './utils/abis';
import { DataSource } from './utils/types';

const AlchemistInterface = new utils.Interface(require('../abis/Alchemist.json'));
const AlchemistEvents = Object.values(AlchemistInterface.events);

export function createAlchemist(name: string, address: string, block: number): DataSource {
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
