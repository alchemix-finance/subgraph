import { Entity, ethereum } from '@graphprotocol/graph-ts';
import { Block, Transaction } from '../generated/schema';
import { uniqueEventId, sortableEventCursor } from './id';

export function getOrCreateBlock(event: ethereum.Event): Block {
  const id = event.block.hash.toHex();
  let entity = Block.load(id);

  if (!entity) {
    entity = new Block(id);
    entity.hash = event.block.hash;
    entity.number = event.block.number;
    entity.timestamp = event.block.timestamp;
    entity.save();
  }

  return entity;
}

export function getOrCreateTransaction(event: ethereum.Event): Transaction {
  const id = event.transaction.hash.toHex();
  let entity = Transaction.load(id);

  if (!entity) {
    entity = new Transaction(id);
    entity.block = getOrCreateBlock(event).id;
    entity.timestamp = event.block.timestamp;
    entity.hash = event.transaction.hash;
    entity.input = event.transaction.input;
    entity.to = event.transaction.to;
    entity.save();
  }

  return entity;
}

export function createEvent<TEvent extends Entity>(event: ethereum.Event): TEvent {
  const block = getOrCreateBlock(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new Entity();
  entity.setString('id', uniqueEventId(event));
  entity.setBigInt('cursor', sortableEventCursor(event));
  entity.setString('transaction', transaction.id);
  entity.setString('block', block.id);
  entity.setBigInt('timestamp', event.block.timestamp);
  entity.setBigInt('index', event.logIndex);

  return changetype<TEvent>(entity);
}
