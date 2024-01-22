// import { utils } from 'ethers';
// import { eventDeclarations } from './utils/abis';
// import { networkName, startBlockNumber } from './utils/constants';
// import { DataSource } from './utils/types';

// const MetaPoolInterface = new utils.Interface(require('../abis/MetaPool.json'));
// const MetaPoolEvents = Object.values(MetaPoolInterface.events);

// export function createMetaPool(name: string, address: string, block: number): DataSource {
//   return {
//     name,
//     network: networkName,
//     kind: 'ethereum/contract',
//     mapping: {
//       apiVersion: '0.0.6',
//       kind: 'ethereum/events',
//       language: 'wasm/assemblyscript',
//       file: 'subgraph/handlers/MetaPool.ts',
//       entities: [],
//       eventHandlers: eventDeclarations(MetaPoolEvents),
//       abis: [
//         {
//           name: 'MetaPool',
//           file: 'abis/MetaPool.json',
//         },
//         {
//           name: 'ERC20',
//           file: 'abis/ERC20.json',
//         },
//       ],
//     },
//     source: {
//       abi: 'MetaPool',
//       address,
//       startBlock: block,
//     },
//   };
// }
