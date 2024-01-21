import { utils } from 'ethers';
import { eventDeclarations } from './utils/abis';
import { networkName } from './utils/constants';
import { DataSource } from './utils/types';

const FactoryPoolInterface = new utils.Interface(require('../abis/FactoryPool.json'));
const FactoryPoolEvents = Object.values(FactoryPoolInterface.events);

export function createFactoryPool(name: string, address: string, block: number): DataSource {
  return {
    name,
    network: networkName,
    kind: 'ethereum/contract',
    mapping: {
      apiVersion: '0.0.6',
      kind: 'ethereum/events',
      language: 'wasm/assemblyscript',
      file: 'subgraph/handlers/FactoryPool.ts',
      entities: [],
      eventHandlers: eventDeclarations(FactoryPoolEvents),
      abis: [
        {
          name: 'FactoryPool',
          file: 'abis/FactoryPool.json',
        },
        {
          name: 'ERC20',
          file: 'abis/ERC20.json',
        },
      ],
    },
    source: {
      abi: 'FactoryPool',
      address,
      startBlock: 14265505,
    },
  };
}
