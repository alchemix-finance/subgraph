import 'dotenv/config';

// import { createThreePoolAssetManager } from '../sources/ThreePoolAssetManager';
// import { createEthAssetManager } from '../sources/EthAssetManager';
import { createAlchemist } from '../sources/Alchemist';
import { createTransmuter } from '../sources/Transmuter';
import { createTransmuterBuffer } from '../sources/TransmuterBuffer';
import { createMetaPool } from '../sources/MetaPool';
import { createFactoryPool } from '../sources/FactoryPool';

export default {
  specVersion: '0.0.4',
  description: 'Alchemix Subgraph',
  repository: 'https://github.com/alchemix-finance/subgraph',
  schema: {
    file: './schema.graphql',
  },
  dataSources: [
    createAlchemist('AlchemistV2_alUSD'),
    createAlchemist('AlchemistV2_alETH'),
    createTransmuter('TransmuterV2_DAI'),
    createTransmuter('TransmuterV2_USDC'),
    createTransmuter('TransmuterV2_USDT'),
    createTransmuter('TransmuterV2_ETH'),
    createTransmuter('TransmuterV2_FRAXETH'),
    createTransmuter('TransmuterV2_FRAX'),
    createTransmuterBuffer('TransmuterBuffer_alUSD'),
    createTransmuterBuffer('TransmuterBuffer_alETH'),
    // createThreePoolAssetManager('ThreePoolAssetManager_alUSD', 17265505, '0x9735F7d3Ea56b454b24fFD74C58E9bD85cfaD31B'),
    // createEthAssetManager('EthAssetManager', 14573961, '0xe761bf731A06fE8259FeE05897B2687D56933110'),
    createMetaPool('alUSDMetaPool', '0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c', 11955332),
    createFactoryPool('alETHFactoryPool', '0xb657b895b265c38c53fff00166cf7f6a3c70587d', 15373989),
  ],
};
