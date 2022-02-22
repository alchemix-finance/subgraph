import { Address, BigInt, Entity, ethereum } from '@graphprotocol/graph-ts';
import { Account, Alchemist, AlchemistDeposit, AlchemistDepositHistory, Block, Transaction } from '../generated/schema';
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

export function getOrCreateAccount(address: Address): Account {
  const id = address.toHex();
  let entity = Account.load(id);

  if (!entity) {
    entity = new Account(id);
    entity.save();
  }

  return entity;
}

export function getOrCreateAlchemistDeposit(account: Account, alchemist: Alchemist): AlchemistDeposit {
  const id = alchemist.id + '/' + account.id;
  let entity = AlchemistDeposit.load(id);

  if (!entity) {
    entity = new AlchemistDeposit(id);
    entity.account = account.id;
    entity.alchemist = alchemist.id;
    entity.shares = BigInt.fromI32(0);
    entity.save();
  }

  return entity;
}

export function getOrCreateAlchemistDepositHistory(
  state: AlchemistDeposit,
  change: BigInt,
  event: string,
  timestamp: BigInt,
  block: string,
  transaction: string,
): AlchemistDepositHistory {
  const id = state.id + '/' + event;
  let entity = AlchemistDepositHistory.load(id);

  if (!entity) {
    entity = new AlchemistDepositHistory(id);
    entity.deposit = state.id;
    entity.change = change;
    entity.account = state.account;
    entity.alchemist = state.alchemist;
    entity.shares = state.shares;
    entity.event = event;
    entity.block = block;
    entity.transaction = transaction;
    entity.timestamp = timestamp;
    entity.save();
  }

  return entity;
}
