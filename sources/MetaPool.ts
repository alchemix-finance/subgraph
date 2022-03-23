import { utils } from 'ethers';
import { eventDeclaration, deploymentAddress } from './utils/abis';
import { networkName } from './utils/constants';
import { DataSource } from './utils/types';

const MetaPoolInterface = new utils.Interface(require('../abis/MetaPool.json'));
const MetaPoolEvents = Object.values(MetaPoolInterface.events);

export function createMetaPool(name: string, block: number, address: string): DataSource {
  return {
    name,
    network: networkName,
    kind: 'ethereum/contract',
    mapping: {
      apiVersion: '0.0.6',
      kind: 'ethereum/events',
      language: 'wasm/assemblyscript',
      file: 'subgraph/handlers/MetaPool.ts',
      entities: [],
      eventHandlers: MetaPoolEvents.map((fragment) => eventDeclaration(fragment)),
      abis: [
        {
          name: 'MetaPool',
          file: 'abis/MetaPool.json',
        },
        {
          name: 'ERC20',
          file: 'abis/ERC20.json',
        },
      ],
    },
    source: {
      abi: 'MetaPool',
      address,
      startBlock: block,
    },
  };
}
