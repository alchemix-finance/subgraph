import { utils } from 'ethers';
import { eventDeclaration, deploymentAddress } from './utils/abis';
import { startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const TransmuterBufferInterface = new utils.Interface(require('../abis/TransmuterBuffer.json'));
const TransmuterBufferEvents = Object.values(TransmuterBufferInterface.events);

export function createTransmuterBuffer(
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
      file: 'subgraph/handlers/TransmuterBuffer.ts',
      entities: [],
      eventHandlers: TransmuterBufferEvents.map((fragment) => eventDeclaration(fragment)),
      abis: [
        {
          name: 'TransmuterBuffer',
          file: 'abis/TransmuterBuffer.json',
        },
      ],
    },
    source: {
      abi: 'TransmuterBuffer',
      address,
      startBlock: block,
    },
  };
}
