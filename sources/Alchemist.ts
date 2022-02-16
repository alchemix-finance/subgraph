import { utils } from 'ethers';
import { eventDeclaration } from './utils/abis';
import { DataSource } from './utils/types';

const AlchemistInterface = new utils.Interface(require('../abis/Alchemist.json'));

export const Alchemist: DataSource = {
  name: 'Alchemist',
  network: 'testnet',
  kind: 'ethereum/contract',
  mapping: {
    apiVersion: '0.0.6',
    kind: 'ethereum/events',
    language: 'wasm/assemblyscript',
    file: 'subgraph/handlers/Alchemist.ts',
    entities: [],
    eventHandlers: Object.values(AlchemistInterface.events).map((fragment) => eventDeclaration(fragment)),
    abis: [
      {
        name: 'Alchemist',
        file: 'abis/Alchemist.json',
      },
    ],
  },
  source: {
    abi: 'Alchemist',
    address: '0x499159659ff0b4c409E90637ee4A39D3f531f0d2',
    startBlock: 13263419,
  },
};
