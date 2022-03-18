import { utils } from 'ethers';
import { eventDeclaration, deploymentAddress } from './utils/abis';
import { networkName, startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const ERC20Interface = new utils.Interface(require('../abis/ERC20.json'));
const ERC20Events = Object.values(ERC20Interface.events);

export function createErc20(name: string, block: number = startBlockNumber): DataSource {
  return {
    name,
    network: networkName,
    kind: 'ethereum/contract',
    mapping: {
      apiVersion: '0.0.6',
      kind: 'ethereum/events',
      language: 'wasm/assemblyscript',
      file: 'subgraph/handlers/ERC20.ts',
      entities: [],
      eventHandlers: ERC20Events.map((fragment) => eventDeclaration(fragment)),
      abis: [
        {
          name: 'ERC20',
          file: 'abis/ERC20.json',
        },
      ],
    },
    source: {
      abi: 'ERC20',
      startBlock: block,
    },
  };
}
