import { ethereum } from '@graphprotocol/graph-ts';

export function uniqueEventId(event: ethereum.Event, suffix: string = ''): string {
  let txHash = event.transaction.hash.toHex();
  let logIndex = event.logIndex.toString();
  return txHash + '/' + logIndex + (suffix != '' ? '/' + suffix : '');
}
