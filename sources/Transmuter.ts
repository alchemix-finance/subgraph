import { utils } from 'ethers';
import { eventDeclarations, deploymentAddress } from './utils/abis';
import { networkName, startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const TransmuterInterface = new utils.Interface(require('../abis/Transmuter.json'));
const TransmuterEvents = Object.values(TransmuterInterface.events);

export function createTransmuter(
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
      file: 'subgraph/handlers/Transmuter.ts',
      entities: [],
      eventHandlers: eventDeclarations(TransmuterEvents),
      abis: [
        {
          name: 'Transmuter',
          file: 'abis/Transmuter.json',
        },
        {
          name: 'ERC20',
          file: 'abis/ERC20.json',
        },
      ],
    },
    source: {
      abi: 'Transmuter',
      address,
      startBlock: 14265505,
    },
  };
}
