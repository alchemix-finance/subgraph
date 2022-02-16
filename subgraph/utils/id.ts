import { BigInt, ethereum } from '@graphprotocol/graph-ts';

export function uniqueEventId(event: ethereum.Event, suffix: string = ''): string {
  let txHash = event.transaction.hash.toHex();
  let logIndex = event.logIndex.toString();
  return txHash + '/' + logIndex + (suffix != '' ? '/' + suffix : '');
}

export function sortableEventCursor(event: ethereum.Event): BigInt {
  let a = event.block.number.toString().padEnd(32, '0');
  let b = event.transaction.index.toString().padEnd(16, '0');
  let c = event.logIndex;

  return BigInt.fromString(a).plus(BigInt.fromString(b)).plus(c);
}
