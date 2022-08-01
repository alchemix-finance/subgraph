export const networkName = process.env.NETWORK_NAME;
export const startBlockNumber = Number(process.env[`START_BLOCK_NUMBER_${process.env.NETWORK_NAME}`]);

if (!(!Number.isNaN(startBlockNumber) && Number.isInteger(startBlockNumber)) && startBlockNumber > 0) {
  console.error('Invalid or missing start block number');
  process.exit(1);
}

if (!networkName) {
  console.error('Missing network name');
  process.exit(1);
}
