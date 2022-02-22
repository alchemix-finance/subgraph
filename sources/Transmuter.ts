import { utils } from 'ethers';
import { eventDeclaration, deploymentAddress } from './utils/abis';
import { networkName, startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const TransmuterInterface = new utils.Interface(require('../abis/Transmuter.json'));
const TransmuterEvents = Object.values(TransmuterInterface.events);

export function createTransmuter(
  name: string,
  block: number = startBlockNumber,
  address: string = deploymentAddress(name),
): DataSource {
  return {
    name,
    network: networkName,
    kind: 'ethereum/contract',
    mapping: {
      apiVersion: '0.0.6',
      kind: 'ethereum/events',
      language: 'wasm/assemblyscript',
      file: 'subgraph/handlers/Transmuter.ts',
      entities: [],
      eventHandlers: TransmuterEvents.map((fragment) => eventDeclaration(fragment)),
      abis: [
        {
          name: 'Transmuter',
          file: 'abis/Transmuter.json',
        },
      ],
    },
    source: {
      abi: 'Transmuter',
      address,
      startBlock: block,
    },
  };
}
