export const startBlockNumber = Number(process.env.START_BLOCK_NUMBER);

if (!(!Number.isNaN(startBlockNumber) && Number.isInteger(startBlockNumber)) && startBlockNumber > 0) {
  console.error('Invalid or missing start block number');
  process.exit(1);
}
