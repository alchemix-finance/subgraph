import { utils } from 'ethers';
import { eventDeclarations, deploymentAddress } from './utils/abis';
import { networkName, startBlockNumber } from './utils/constants';
import { DataSource } from './utils/types';

const TransmuterBufferInterface = new utils.Interface(require('../abis/TransmuterBuffer.json'));
const TransmuterBufferEvents = Object.values(TransmuterBufferInterface.events);

export function createTransmuterBuffer(
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
      file: 'subgraph/handlers/TransmuterBuffer.ts',
      entities: [],
      eventHandlers: eventDeclarations(TransmuterBufferEvents),
      abis: [
        {
          name: 'TransmuterBuffer',
          file: 'abis/TransmuterBuffer.json',
        },
        {
          name: 'ERC20',
          file: 'abis/ERC20.json',
        },
      ],
    },
    source: {
      abi: 'TransmuterBuffer',
      address,
      startBlock: startBlockNumber,
    },
  };
}
