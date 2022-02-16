import { utils } from 'ethers';
import { eventDeclaration } from './utils/abis';
import { DataSource } from './utils/types';

const TransmuterInterface = new utils.Interface(require('../abis/Transmuter.json'));

export const Transmuter: DataSource = {
  name: 'Transmuter',
  network: 'testnet',
  kind: 'ethereum/contract',
  mapping: {
    apiVersion: '0.0.6',
    kind: 'ethereum/events',
    language: 'wasm/assemblyscript',
    file: 'subgraph/handlers/Transmuter.ts',
    entities: [],
    eventHandlers: Object.values(TransmuterInterface.events).map((fragment) => eventDeclaration(fragment)),
    abis: [
      {
        name: 'Transmuter',
        file: 'abis/Transmuter.json',
      },
    ],
  },
  source: {
    abi: 'Transmuter',
    address: '0x5712842165c2d9Eb54EA4dC0e0a2627c4Fb5db25',
    startBlock: 13263419,
  },
};
