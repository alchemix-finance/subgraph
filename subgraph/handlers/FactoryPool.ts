import { Address, dataSource, DataSourceContext, ethereum, BigInt, Bytes, log, Entity } from '@graphprotocol/graph-ts';
import { decimal, integer, ETH_TOKEN_ADDRESS } from '@protofire/subgraph-toolkit';
import { getDailyTradeVolume, getHourlyTradeVolume, getWeeklyTradeVolume } from './volume';
import {
  AddLiquidity,
  FactoryPool,
  RemoveLiquidity,
  RemoveLiquidityImbalance,
  RemoveLiquidityOne,
  TokenExchange,
} from '../generated/alETHFactoryPool/FactoryPool';
import { ERC20, Transfer } from '../generated/alETHFactoryPool/ERC20';
import { ALETH_PAIRED_ASSETS } from '../utils/constants';
import {
  PoolAddLiquidityEvent,
  Coin,
  PoolExchange,
  Pool,
  PoolRemoveLiquidityEvent,
  PoolRemoveLiquidityOneEvent,
  Token,
  UnderlyingCoin,
  PoolRate,
  PoolHistoricalRate,
} from '../generated/schema';
import { getOrCreateAccount, createEvent } from '../utils/entities';

function createFactoryPoolEvent<TEvent extends Entity>(event: ethereum.Event): TEvent {
  const pool = getOrCreatePool(event.address, event);
  const entity = createEvent<TEvent>(event);
  entity.setString('contract', pool.id);

  return entity;
}

function getEventId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
}

function getPoolSnapshot(pool: Pool, poolAddress: Address, event: ethereum.Event): Pool {
  if (pool != null) {
    let poolContract = FactoryPool.bind(poolAddress);

    // Update coin balances and underlying coin balances/rates
    saveCoins(pool, poolAddress, event);

    // Save current virtual price
    let virtualPrice = poolContract.try_get_virtual_price();

    if (!virtualPrice.reverted) {
      pool.virtualPrice = decimal.fromBigInt(virtualPrice.value);
    }
  }

  return pool;
}

export function handleAddLiquidity(event: AddLiquidity): void {
  createFactoryPoolEvent<PoolAddLiquidityEvent>(event);
  let pool = getOrCreatePool(event.address, event);

  if (pool != null) {
    pool = getPoolSnapshot(pool, event.address, event);

    let provider = getOrCreateAccount(event.params.provider);

    // Save event log
    let log = new PoolAddLiquidityEvent('al-' + getEventId(event));
    log.pool = pool.id;
    log.provider = provider.id;
    log.tokenAmounts = event.params.token_amounts;
    log.fees = event.params.fees;
    log.invariant = event.params.invariant;
    log.tokenSupply = event.params.token_supply;
    log.block = event.block.hash.toHex();
    log.timestamp = event.block.timestamp;
    log.transaction = event.transaction.hash;
    log.save();

    pool.save();
  }
}

export function handleRampA(): void {}
export function handleStopRampA(): void {}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  createFactoryPoolEvent<PoolRemoveLiquidityEvent>(event);
  let pool = getOrCreatePool(event.address, event);

  if (pool != null) {
    pool = getPoolSnapshot(pool, event.address, event);

    let provider = getOrCreateAccount(event.params.provider);

    // Save event log
    let log = new PoolRemoveLiquidityEvent('rl-' + getEventId(event));
    log.pool = pool.id;
    log.provider = provider.id;
    log.tokenAmounts = event.params.token_amounts;
    log.fees = event.params.fees;
    log.tokenSupply = event.params.token_supply;
    log.block = event.block.hash.toHex();
    log.timestamp = event.block.timestamp;
    log.transaction = event.transaction.hash;
    log.save();

    pool.save();
  }
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityImbalance): void {}

export function handleRemoveLiquidityOne(event: RemoveLiquidityOne): void {
  createFactoryPoolEvent<PoolRemoveLiquidityOneEvent>(event);
  let pool = getOrCreatePool(event.address, event);

  if (pool != null) {
    pool = getPoolSnapshot(pool, event.address, event);

    let provider = getOrCreateAccount(event.params.provider);

    // Save event log
    let log = new PoolRemoveLiquidityOneEvent('rlo-' + getEventId(event));
    log.pool = pool.id;
    log.provider = provider.id;
    log.tokenAmount = event.params.token_amount;
    log.coinAmount = event.params.coin_amount;
    log.block = event.block.hash.toHex();
    log.timestamp = event.block.timestamp;
    log.transaction = event.transaction.hash;
    log.save();

    pool.save();
  }
}

export function handleTransfer(event: Transfer): void {}

export function handleApproval(event: Transfer): void {}

function getOrCreatePool(address: Address, event: ethereum.Event): Pool {
  let pool = Pool.load(address.toHexString());

  if (pool == null) {
    let poolContract = FactoryPool.bind(address as Address);

    pool = new Pool(address.toHexString());
    pool.swapAddress = poolContract._address;

    // Counters
    pool.coinCount = BigInt.fromI32(2);
    pool.exchangeCount = integer.ZERO;
    pool.underlyingCount = BigInt.fromI32(4);

    pool.isMeta = true;

    // Coin balances and underlying coin balances/rates
    saveCoins(pool, address, event);

    // TODO: Calculate pool locked value
    pool.locked = decimal.ZERO;

    // Virtual price
    let virtualPrice = poolContract.try_get_virtual_price();

    pool.virtualPrice = virtualPrice.reverted ? decimal.ZERO : decimal.fromBigInt(virtualPrice.value);

    // Save new pool entity
    pool.addedAt = event.block.timestamp;
    pool.addedAtBlock = event.block.number;
    pool.addedAtTransaction = event.transaction.hash;

    pool.save();
  }

  return pool;
}

export function getCoins(pool: Pool, poolAddress: Address): Address[] {
  let addys: Address[] = [];
  let poolContract = FactoryPool.bind(poolAddress);
  for (let i = 0; i < 4; i++) {
    let coinAddress = poolContract.try_coins(BigInt.fromI32(i));
    if (coinAddress) {
      addys.push(coinAddress.value);
    }
  }
  return addys;
}

export function getOrCreateCoin(
  pool: Pool,
  token: Token,
  coinIdx: number,
  balance: BigInt,
  event: ethereum.Event,
): Coin {
  let coinId = pool.id + '-' + coinIdx.toString();
  let coin = Coin.load(coinId);
  if (!coin) {
    coin = new Coin(coinId);
    coin.index = coinIdx as i32;
    coin.pool = pool.id;
    coin.token = token.id;
    coin.underlying = coin.id;
  }
  coin.balance = balance ? decimal.fromBigInt(balance, token.decimals.toI32()) : decimal.ZERO;
  coin.updated = event.block.timestamp;
  coin.updatedAtBlock = event.block.number;
  coin.updatedAtTransaction = event.transaction.hash;
  coin.save();
  return coin;
}

export function getOrCreateUnderlyingCoin(
  pool: Pool,
  token: Token,
  coinIdx: number,
  event: ethereum.Event,
): UnderlyingCoin {
  let underlyingCoinId = 'underlying-' + pool.id + '-' + coinIdx.toString();
  let underlyingCoin = UnderlyingCoin.load(underlyingCoinId);
  if (!underlyingCoin) {
    underlyingCoin = new UnderlyingCoin(underlyingCoinId);
    underlyingCoin.index = coinIdx as i32;
    underlyingCoin.pool = pool.id;
    underlyingCoin.token = token.id;
    underlyingCoin.coin = underlyingCoin.id;
    // underlyingCoin.balance = balances ? decimal.fromBigInt(balances![i]) : decimal.ZERO
  }
  underlyingCoin.balance = decimal.ZERO;
  underlyingCoin.updated = event.block.timestamp;
  underlyingCoin.updatedAtBlock = event.block.number;
  underlyingCoin.updatedAtTransaction = event.transaction.hash;
  underlyingCoin.save();
  return underlyingCoin;
}

export function saveCoins(pool: Pool, poolAddress: Address, event: ethereum.Event): void {
  let poolContract = FactoryPool.bind(poolAddress);

  let addys: Address[] = [];
  for (let i = 0; i < 2; i++) {
    let coinAddress = poolContract.try_coins(BigInt.fromI32(i));
    if (coinAddress) {
      addys.push(coinAddress.value);
      let token = getOrCreateToken(coinAddress.value, event);
      let balance = poolContract.balances(BigInt.fromI32(i));
      getOrCreateCoin(pool, token, i, balance, event);
    }
  }

  let alToken = getOrCreateToken(addys[1], event);

  let token = getOrCreateToken(Address.fromString(ALETH_PAIRED_ASSETS[0]), event);
  let dec = alToken.decimals.toI32();
  saveRate(
    pool,
    poolAddress,
    alToken.address,
    BigInt.fromI32(1),
    Address.fromString(ALETH_PAIRED_ASSETS[0]),
    BigInt.fromI32(0),
    BigInt.fromI32(500).times(BigInt.fromI32(10).pow(dec as u8)),
    event,
  ); // 1m
  saveRate(
    pool,
    poolAddress,
    alToken.address,
    BigInt.fromI32(1),
    Address.fromString(ALETH_PAIRED_ASSETS[0]),
    BigInt.fromI32(0),
    BigInt.fromI32(5000).times(BigInt.fromI32(10).pow(dec as u8)),
    event,
  ); // 10m
  saveRate(
    pool,
    poolAddress,
    alToken.address,
    BigInt.fromI32(1),
    Address.fromString(ALETH_PAIRED_ASSETS[0]),
    BigInt.fromI32(0),
    BigInt.fromI32(20000).times(BigInt.fromI32(10).pow(dec as u8)),
    event,
  ); // 50m
  getOrCreateUnderlyingCoin(pool, token, 0, event);
}

export function saveRate(
  pool: Pool,
  poolAddress: Address,
  inputToken: Bytes,
  inputIdx: BigInt,
  outputToken: Bytes,
  outputIdx: BigInt,
  inputAmount: BigInt,
  event: ethereum.Event,
): void {
  let swapContract = FactoryPool.bind(poolAddress);
  let outputAmount = swapContract.try_get_dy(inputIdx, outputIdx, inputAmount);
  let id = pool.id + '/' + inputToken.toHex() + '/' + outputToken.toHex() + '/' + inputAmount.toString();
  let rate = PoolRate.load(id);
  if (!rate) {
    rate = new PoolRate(id);
    rate.pool = pool.id;
    rate.inputToken = inputToken;
    rate.outputToken = outputToken;
    rate.inputAmount = inputAmount;
  }
  if (!outputAmount.reverted) {
    rate.outputAmount = outputAmount.value;
  } else {
    rate.outputAmount = BigInt.fromI32(0);
  }
  rate.save();

  saveHistoricalPoolRate(rate as PoolRate, event);
}

export function saveHistoricalPoolRate(rate: PoolRate, event: ethereum.Event): void {
  let id = rate.id + '/' + event.block.number.toString() + '/' + event.transaction.index.toString();
  let historicalPoolRate = PoolHistoricalRate.load(id);
  if (!historicalPoolRate) {
    historicalPoolRate = new PoolHistoricalRate(id);
    historicalPoolRate.rate = rate.id;
    historicalPoolRate.timestamp = event.block.timestamp;
    historicalPoolRate.block = event.block.hash.toHex();
    historicalPoolRate.txIdx = event.transaction.index;
    historicalPoolRate.inputToken = rate.inputToken;
    historicalPoolRate.outputToken = rate.outputToken;
    historicalPoolRate.inputAmount = rate.inputAmount;
    historicalPoolRate.outputAmount = rate.outputAmount;
    historicalPoolRate.save();
  }
}

class TokenInfo {
  constructor(readonly name: string | null, readonly symbol: string | null, readonly decimals: i32) {}
}

export function getOrCreateToken(address: Address, event: ethereum.Event): Token {
  let token = Token.load(address.toHexString());

  if (token == null) {
    token = new Token(address.toHexString());
    token.address = address;

    if (token.id == ETH_TOKEN_ADDRESS) {
      token.name = 'Ether';
      token.symbol = 'ETH';
      token.decimals = BigInt.fromI32(18);
    } else {
      let info = getTokenInfo(address);

      token.name = info.name;
      token.symbol = info.symbol;
      token.decimals = BigInt.fromI32(info.decimals);
    }

    token.save();
  }

  return token;
}

function getTokenInfo(address: Address): TokenInfo {
  let erc20 = ERC20.bind(address);

  let name = erc20.try_name();
  let symbol = erc20.try_symbol();
  let decimals = erc20.try_decimals();

  return new TokenInfo(
    name.reverted ? '' : name.value.toString(),
    symbol.reverted ? '' : symbol.value.toString(),
    decimals.reverted ? 18 : decimals.value,
  );
}
export function handleTokenExchange(event: TokenExchange): void {}
// export function handleTokenExchange(event: TokenExchange): void {
//   let pool = getOrCreatePool(event.address, event);

//     if (pool != null) {
//       pool = getPoolSnapshot(pool, event.address, event)

//       let coinSold = Coin.load(pool.id + '-' + event.params.sold_id.toString())!
//       let tokenSold = Token.load(coinSold.token)!
//       let amountSold = decimal.fromBigInt(event.params.tokens_sold, tokenSold.decimals.toI32())

//       let coinBought = Coin.load(pool.id + '-' + event.params.bought_id.toString())!
//       let tokenBought = Token.load(coinBought.token)!
//       let amountBought = decimal.fromBigInt(event.params.tokens_bought, tokenBought.decimals.toI32())

//       let buyer = getOrCreateAccount(event.params.buyer)

//       // Save event log
//       let exchange = new PoolExchange('e-' + getEventId(event))
//       exchange.pool = pool.id
//       exchange.buyer = buyer.id
//       exchange.receiver = buyer.id
//       exchange.tokenSold = tokenSold.id
//       exchange.tokenBought = tokenBought.id
//       exchange.amountSold = amountSold
//       exchange.amountBought = amountBought
//       exchange.block = event.block.number
//       exchange.timestamp = event.block.timestamp
//       exchange.transaction = event.transaction.hash
//       exchange.save()

//       // Save trade volume
//       let volume = exchange.amountSold.plus(exchange.amountBought).div(decimal.TWO)

//       let hourlyVolume = getHourlyTradeVolume(pool, event.block.timestamp)
//       hourlyVolume.volume = hourlyVolume.volume.plus(volume)
//       hourlyVolume.save()

//       let dailyVolume = getDailyTradeVolume(pool, event.block.timestamp)
//       dailyVolume.volume = dailyVolume.volume.plus(volume)
//       dailyVolume.save()

//       let weeklyVolume = getWeeklyTradeVolume(pool, event.block.timestamp)
//       weeklyVolume.volume = weeklyVolume.volume.plus(volume)
//       weeklyVolume.save()

//       pool.exchangeCount = integer.increment(pool.exchangeCount)
//       pool.save()
//     }
//   }
