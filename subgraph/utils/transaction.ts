import { ethereum } from '@graphprotocol/graph-ts';
import { Transaction } from '../generated/schema';

export function getOrCreateTransaction(event: ethereum.Event): Transaction {
  let entity = Transaction.load(event.transaction.hash.toHex());

  if (!entity) {
    entity = new Transaction(event.transaction.hash.toHex());
    entity.save();
  }

  return entity;
}
