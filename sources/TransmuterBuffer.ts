import { utils } from 'ethers';
import { eventDeclaration } from './utils/abis';
import { DataSource } from './utils/types';

const TransmuterBufferInterface = new utils.Interface(require('../abis/TransmuterBuffer.json'));

export const TransmuterBuffer: DataSource = {
  name: 'TransmuterBuffer',
  network: 'testnet',
  kind: 'ethereum/contract',
  mapping: {
    apiVersion: '0.0.6',
    kind: 'ethereum/events',
    language: 'wasm/assemblyscript',
    file: 'subgraph/handlers/TransmuterBuffer.ts',
    entities: [],
    eventHandlers: Object.values(TransmuterBufferInterface.events).map((fragment) => eventDeclaration(fragment)),
    abis: [
      {
        name: 'TransmuterBuffer',
        file: 'abis/TransmuterBuffer.json',
      },
    ],
  },
  source: {
    abi: 'TransmuterBuffer',
    address: '0x9D63c5d356dc659DA203b25E8681d11F502B9b0b',
    startBlock: 13263419,
  },
};
