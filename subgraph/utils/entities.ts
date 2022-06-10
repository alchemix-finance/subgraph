import { Address, BigInt, Entity, ethereum } from '@graphprotocol/graph-ts';
import {
  Account,
  Alchemist,
  AlchemistBalance,
  AlchemistBalanceHistory,
  Block,
  Transaction,
  YieldToken,
  DebtToken,
  TransmuterBalance,
  Transmuter,
  TransmuterBalanceHistory,
  AlchemistTVL,
  AlchemistTVLHistory,
  AlchemistGlobalDebt,
  AlchemistGlobalDebtHistory,
  UnderlyingToken,
  ThreePoolAssetManager,
  ThreePoolAssetManagerThreePoolTokenBalanceHistory,
  ThreePoolAssetManagerMetaPoolTokenBalanceHistory,
  ThreePoolAssetManagerToken,
  RewardsHistory,
  EthAssetManager,
  EthAssetManagerToken,
  EthAssetManagerMetaPoolTokenBalanceHistory,
} from '../generated/schema';
import { ERC20 as ERC20Contract } from '../generated/AlchemistV2_alUSD/ERC20';
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

export function getOrCreateAlchemistBalance(
  account: Account,
  alchemist: Alchemist,
  yieldToken: YieldToken,
): AlchemistBalance {
  const id = alchemist.id + '/' + account.id + '/' + yieldToken.id;
  let entity = AlchemistBalance.load(id);

  if (!entity) {
    entity = new AlchemistBalance(id);
    entity.account = account.id;
    entity.alchemist = alchemist.id;
    entity.yieldToken = yieldToken.id;
    entity.shares = BigInt.fromI32(0);
    entity.underlyingValue = BigInt.fromI32(0);
    entity.save();
  }

  return entity;
}

export function getOrCreateAlchemistBalanceHistory(
  state: AlchemistBalance,
  change: BigInt,
  event: ethereum.Event,
): AlchemistBalanceHistory {
  const eventId = uniqueEventId(event);
  const id = state.id + '/' + eventId;
  let entity = AlchemistBalanceHistory.load(id);

  if (!entity) {
    entity = new AlchemistBalanceHistory(id);
    entity.balance = state.id;
    entity.change = change;
    entity.account = state.account;
    entity.alchemist = state.alchemist;
    entity.yieldToken = state.yieldToken;
    entity.shares = state.shares;
    entity.underlyingValue = state.underlyingValue;
    entity.event = eventId;
    entity.block = event.block.hash.toHex();
    entity.transaction = event.transaction.hash.toHex();
    entity.timestamp = event.block.timestamp;
    entity.save();
  }

  return entity;
}

export function getOrCreateDebtToken(id: Address): DebtToken {
  let entity = DebtToken.load(id.toHex());

  if (!entity) {
    entity = new DebtToken(id.toHex());
    entity.decimals = BigInt.fromI32(18);
    const debtTokenContract = ERC20Contract.bind(id);
    entity.name = debtTokenContract.name();
    entity.symbol = debtTokenContract.symbol();
    entity.save();
  }

  return entity;
}

export function getOrCreateYieldToken(id: Address): YieldToken {
  let entity = YieldToken.load(id.toHex());

  if (!entity) {
    entity = new YieldToken(id.toHex());
    entity.decimals = BigInt.fromI32(18);
    entity.underlyingToken = '0x0000000000000000000000000000000000000000';
    const yieldTokenContract = ERC20Contract.bind(id);
    entity.name = yieldTokenContract.name();
    entity.symbol = yieldTokenContract.symbol();
    entity.save();
  }

  return entity;
}

export function getOrCreateUnderlyingToken(id: Address): UnderlyingToken {
  let entity = UnderlyingToken.load(id.toHex());

  if (!entity) {
    entity = new UnderlyingToken(id.toHex());
    entity.decimals = BigInt.fromI32(18);
    const underlyingTokenContract = ERC20Contract.bind(id);
    entity.name = underlyingTokenContract.name();
    entity.symbol = underlyingTokenContract.symbol();
    entity.save();
  }

  return entity;
}

export function getOrCreateTransmuterBalance(transmuter: Transmuter, account: Account): TransmuterBalance {
  const id = transmuter.id + '/' + account.id;
  let entity = TransmuterBalance.load(id);

  if (!entity) {
    entity = new TransmuterBalance(id);
    entity.transmuter = transmuter.id;
    entity.balance = BigInt.fromI32(0);
    entity.save();
  }

  return entity;
}

export function getOrCreateTransmuterBalanceHistory(
  state: TransmuterBalance,
  change: BigInt,
  event: ethereum.Event,
): TransmuterBalanceHistory {
  const eventId = uniqueEventId(event);
  const id = state.id + '/' + eventId;
  let entity = TransmuterBalanceHistory.load(id);

  if (!entity) {
    entity = new TransmuterBalanceHistory(id);
    entity.account = state.account;
    entity.change = change;
    entity.balance = state.id;
    entity.value = state.balance;
    entity.event = eventId;
    entity.block = event.block.hash.toHex();
    entity.transaction = event.transaction.hash.toHex();
    entity.timestamp = event.block.timestamp;
    entity.save();
  }

  return entity;
}

export function getOrCreateAlchemistTVL(
  alchemist: Alchemist,
  token: YieldToken,
  amount: BigInt,
  underlyingValue: BigInt,
): AlchemistTVL {
  const id = alchemist.id + '/' + token.id;
  let entity = AlchemistTVL.load(id);

  if (!entity) {
    entity = new AlchemistTVL(id);
    entity.alchemist = alchemist.id;
    entity.token = token.id;
    entity.amount = amount;
    entity.underlyingValue = underlyingValue;
    entity.save();
  }

  return entity;
}

export function getOrCreateAlchemistTVLHistory(
  state: AlchemistTVL,
  amountChange: BigInt,
  underlyingValueChange: BigInt,
  event: ethereum.Event,
): AlchemistTVLHistory {
  const eventId = uniqueEventId(event);
  const id = state.id + '/' + eventId;
  let entity = AlchemistTVLHistory.load(id);

  if (!entity) {
    entity = new AlchemistTVLHistory(id);
    entity.tvl = state.id;
    entity.alchemist = state.alchemist;
    entity.token = state.token;
    entity.amount = state.amount;
    entity.amountChange = amountChange;
    entity.underlyingValue = state.underlyingValue;
    entity.underlyingValueChange = underlyingValueChange;
    entity.block = event.block.hash.toHex();
    entity.transaction = event.transaction.hash.toHex();
    entity.timestamp = event.block.timestamp;
    entity.save();
  }

  return entity;
}

export function getOrCreateAlchemistGlobalDebt(alchemist: Alchemist): AlchemistGlobalDebt {
  const id = 'global-debt' + '/' + alchemist.id;
  let entity = AlchemistGlobalDebt.load(id);

  if (!entity) {
    entity = new AlchemistGlobalDebt(id);
    entity.alchemist = alchemist.id;
    entity.debt = BigInt.fromI32(0);
    entity.save();
  }

  return entity;
}

export function getOrCreateAlchemistGlobalDebtHistory(
  state: AlchemistGlobalDebt,
  event: ethereum.Event,
): AlchemistGlobalDebtHistory {
  const eventId = uniqueEventId(event);
  const id = state.id + '/' + eventId;
  let entity = AlchemistGlobalDebtHistory.load(id);

  if (!entity) {
    entity = new AlchemistGlobalDebtHistory(id);
    entity.alchemist = state.alchemist;
    entity.debt = state.debt;
    entity.block = event.block.hash.toHex();
    entity.transaction = event.transaction.hash.toHex();
    entity.save();
  }

  return entity;
}

export function getOrCreateThreePoolAssetManagerTokenBalance(
  threePoolAssetManager: ThreePoolAssetManager,
  token: UnderlyingToken,
): ThreePoolAssetManagerToken {
  const id = threePoolAssetManager.id + '/' + token.id;
  let entity = ThreePoolAssetManagerToken.load(id);

  if (!entity) {
    entity = new ThreePoolAssetManagerToken(id);
    entity.token = token.id;
    entity.amount = BigInt.fromI32(0);
    entity.save();
  }

  return entity;
}

export function getOrCreateThreePoolAssetManagerThreePoolTokenBalanceHistory(
  state: ThreePoolAssetManagerToken,
  amountChange: BigInt,
  event: ethereum.Event,
): ThreePoolAssetManagerThreePoolTokenBalanceHistory {
  const eventId = uniqueEventId(event);
  const id = state.id + '/' + eventId;
  let entity = ThreePoolAssetManagerThreePoolTokenBalanceHistory.load(id);

  if (!entity) {
    entity = new ThreePoolAssetManagerThreePoolTokenBalanceHistory(id);
    entity.transaction = event.transaction.hash.toHex();
    entity.threePoolToken = state.token;
    entity.threePoolAssetManager = state.id;
    entity.amountChange = amountChange;
    entity.balance = state.amount;
    entity.event = eventId;
    entity.block = event.block.hash.toHex();
    entity.timestamp = event.block.timestamp;
  }

  return entity;
}

export function getOrCreateThreePoolAssetManagerMetaPoolTokenBalanceHistory(
  state: ThreePoolAssetManagerToken,
  amountChange: BigInt,
  event: ethereum.Event,
): ThreePoolAssetManagerMetaPoolTokenBalanceHistory {
  const eventId = uniqueEventId(event);
  const id = state.id + '/' + eventId;
  let entity = ThreePoolAssetManagerMetaPoolTokenBalanceHistory.load(id);

  if (!entity) {
    entity = new ThreePoolAssetManagerMetaPoolTokenBalanceHistory(id);
    entity.transaction = event.transaction.hash.toHex();
    entity.metaPoolToken = state.token;
    entity.threePoolAssetManager = state.id;
    entity.amountChange = amountChange;
    entity.balance = state.amount;
    entity.event = eventId;
    entity.block = event.block.hash.toHex();
    entity.timestamp = event.block.timestamp;
  }

  return entity;
}

export function getOrCreateThreePoolAssetManagerRewardsHistory(
  curveState: ThreePoolAssetManagerToken,
  convexState: ThreePoolAssetManagerToken,
  amountChangeCurve: BigInt,
  amountChangeConvex: BigInt,
  event: ethereum.Event,
): RewardsHistory {
  const eventId = uniqueEventId(event);
  const id = curveState.id + '/' + convexState.id + '/' + eventId;
  let entity = RewardsHistory.load(id);

  if (!entity) {
    entity = new RewardsHistory(id);
    entity.transaction = event.transaction.hash.toHex();
    entity.curveToken = curveState.id;
    entity.convexToken = convexState.id;
    entity.amountChangeCurve = amountChangeCurve;
    entity.amountChangeConvex = amountChangeConvex;
    entity.curveBalance = curveState.amount;
    entity.convexBalance = convexState.amount;
    entity.event = eventId;
    entity.block = event.block.hash.toHex();
    entity.timestamp = event.block.timestamp;
  }

  return entity;
}

export function getOrCreateEthAssetManagerTokenBalance(
  ethAssetManager: EthAssetManager,
  token: UnderlyingToken,
): EthAssetManagerToken {
  const id = ethAssetManager.id + '/' + token.id;
  let entity = EthAssetManagerToken.load(id);

  if (!entity) {
    entity = new EthAssetManagerToken(id);
    entity.token = token.id;
    entity.amount = BigInt.fromI32(0);
    entity.save();
  }

  return entity;
}

export function getOrCreateEthAssetManagerMetaPoolTokenBalanceHistory(
  state: EthAssetManagerToken,
  amountChange: BigInt,
  event: ethereum.Event,
): EthAssetManagerMetaPoolTokenBalanceHistory {
  const eventId = uniqueEventId(event);
  const id = state.id + '/' + eventId;
  let entity = EthAssetManagerMetaPoolTokenBalanceHistory.load(id);

  if (!entity) {
    entity = new EthAssetManagerMetaPoolTokenBalanceHistory(id);
    entity.transaction = event.transaction.hash.toHex();
    entity.metaPoolToken = state.token;
    entity.ethAssetManager = state.id;
    entity.amountChange = amountChange;
    entity.balance = state.amount;
    entity.event = eventId;
    entity.block = event.block.hash.toHex();
    entity.timestamp = event.block.timestamp;
  }

  return entity;
}

export function getOrCreateEthAssetManagerRewardsHistory(
  curveState: EthAssetManagerToken,
  convexState: EthAssetManagerToken,
  amountChangeCurve: BigInt,
  amountChangeConvex: BigInt,
  event: ethereum.Event,
): RewardsHistory {
  const eventId = uniqueEventId(event);
  const id = curveState.id + '/' + convexState.id + '/' + eventId;
  let entity = RewardsHistory.load(id);

  if (!entity) {
    entity = new RewardsHistory(id);
    entity.transaction = event.transaction.hash.toHex();
    entity.curveToken = curveState.id;
    entity.convexToken = convexState.id;
    entity.amountChangeCurve = amountChangeCurve;
    entity.amountChangeConvex = amountChangeConvex;
    entity.curveBalance = curveState.amount;
    entity.convexBalance = convexState.amount;
    entity.event = eventId;
    entity.block = event.block.hash.toHex();
    entity.timestamp = event.block.timestamp;
  }

  return entity;
}
