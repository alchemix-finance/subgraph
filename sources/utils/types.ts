export interface DataSource {
  kind: 'ethereum/contract';
  name: string;
  network: string;
  source: {
    abi: string;
    address?: string;
    startBlock?: number;
  };
  mapping: {
    kind: 'ethereum/events';
    apiVersion: '0.0.6';
    language: 'wasm/assemblyscript';
    entities: [];
    abis: {
      name: string;
      file: string;
    }[];
    eventHandlers: {
      event: string;
      handler: string;
    }[];
    file: string;
  };
}
