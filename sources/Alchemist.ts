import { utils } from 'ethers';
import { eventDeclarations, deploymentAddress } from './utils/abis';
import { networkName, startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const AlchemistInterface = new utils.Interface(require('../abis/Alchemist.json'));
const AlchemistEvents = Object.values(AlchemistInterface.events);

export function createAlchemist(
  name: string,
  address: string = deploymentAddress(name),
  block: number = startBlockNumber,
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
      eventHandlers: eventDeclarations(AlchemistEvents),
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
      startBlock: 14265505,
    },
  };
}
