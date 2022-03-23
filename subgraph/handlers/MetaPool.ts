import { Address, dataSource, DataSourceContext, ethereum, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { decimal, integer, ETH_TOKEN_ADDRESS } from '@protofire/subgraph-toolkit';
import {
  AddLiquidity,
  MetaPool,
  RemoveLiquidity,
  RemoveLiquidityImbalance,
  RemoveLiquidityOne,
} from '../generated/alUSDMetaPool/MetaPool';
import { ERC20 } from '../generated/alUSDMetaPool/ERC20';
import { ALUSD_PAIRED_ASSETS } from '../utils/constants';
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
import { getOrCreateAccount } from '../utils/entities';

function getEventId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
}

function getPoolSnapshot(pool: Pool, event: ethereum.Event): Pool {
  if (pool != null) {
    let poolAddress = pool.swapAddress as Address;
    let poolContract = MetaPool.bind(poolAddress as Address);

    // Update coin balances and underlying coin balances/rates
    saveCoins(pool, event);

    // Save current virtual price
    let virtualPrice = poolContract.try_get_virtual_price();

    if (!virtualPrice.reverted) {
      pool.virtualPrice = decimal.fromBigInt(virtualPrice.value);
    }
  }

  return pool;
}

export function handleAddLiquidityEvent(event: AddLiquidity): void {
  let pool = Pool.load(event.address.toHexString());

  if (pool != null) {
    pool = getPoolSnapshot(pool, event);

    let provider = getOrCreateAccount(event.params.provider);

    // Save event log
    let log = new PoolAddLiquidityEvent('al-' + getEventId(event));
    log.pool = pool.id;
    log.provider = provider.id;
    log.tokenAmounts = event.params.token_amounts;
    log.fees = event.params.fees;
    log.invariant = event.params.invariant;
    log.tokenSupply = event.params.token_supply;
    log.block = event.block.number;
    log.timestamp = event.block.timestamp;
    log.transaction = event.transaction.hash;
    log.save();

    pool.save();
  }
}

export function handleRemoveLiquidityEvent(event: RemoveLiquidity): void {}

export function handleRemoveLiquidityImbalanceEvent(event: RemoveLiquidityImbalance): void {}

export function handleRemoveLiquidityOneEvent(event: RemoveLiquidityOne): void {}

function getOrCreatePool(address: Address, event: ethereum.Event): Pool {
  let pool = Pool.load(address.toHexString());

  if (pool == null) {
    let poolContract = MetaPool.bind(address as Address);

    pool = new Pool(address.toHexString());
    pool.swapAddress = poolContract._address;

    // Counters
    pool.coinCount = BigInt.fromI32(2);
    pool.exchangeCount = integer.ZERO;
    pool.underlyingCount = BigInt.fromI32(4);

    pool.isMeta = true;

    // Coin balances and underlying coin balances/rates
    saveCoins(pool, event);

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

export function getCoins(pool: Pool): Address[] {
  let addys: Address[] = [];
  let poolContract = MetaPool.bind(pool.swapAddress as Address);
  for (let i = 0; i < 4; i++) {
    let coinAddress = poolContract.try_coins(BigInt.fromI32(i));
    if (coinAddress) {
      addys.push(coinAddress.value);
    }
  }
  return addys;
}

export function saveCoins(pool: Pool, event: ethereum.Event): void {
  let poolContract = MetaPool.bind(pool.swapAddress as Address);

  let addys: Address[] = [];
  for (let i = 0; i < 4; i++) {
    let coinAddress = poolContract.try_coins(BigInt.fromI32(i));
    if (coinAddress) {
      addys.push(coinAddress.value);
      let token = getOrCreateToken(coinAddress.value, event);

      let balance = poolContract.balances(BigInt.fromI32(i));
      let coin = new Coin(pool.id + '-' + i.toString());
      coin.index = i;
      coin.pool = pool.id;
      coin.token = token.id;
      coin.underlying = coin.id;
      coin.balance = balance ? decimal.fromBigInt(balance, token.decimals.toI32()) : decimal.ZERO;
      coin.updated = event.block.timestamp;
      coin.updatedAtBlock = event.block.number;
      coin.updatedAtTransaction = event.transaction.hash;
      coin.save();
    }
  }

  let alToken = getOrCreateToken(addys[0], event);
  let pairedAssets: string[] = [];
  if (alToken.address.toHex() === '0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c') {
    pairedAssets = ALUSD_PAIRED_ASSETS;
  }
  for (let i = 0; i < 4; i++) {
    let coinAddress = poolContract.try_coins(BigInt.fromI32(i));
    if (coinAddress) {
      let token = getOrCreateToken(Address.fromString(pairedAssets[i]), event);

      if (i != 0) {
        let dec = alToken.decimals.toI32();
        saveRate(
          pool,
          alToken.address,
          BigInt.fromI32(0),
          Address.fromString(pairedAssets[i]),
          BigInt.fromI32(i),
          BigInt.fromI32(1000000).times(BigInt.fromI32(10).pow(dec as u8)),
          event,
        ); // 1m
        saveRate(
          pool,
          alToken.address,
          BigInt.fromI32(0),
          Address.fromString(pairedAssets[i]),
          BigInt.fromI32(i),
          BigInt.fromI32(10000000).times(BigInt.fromI32(10).pow(dec as u8)),
          event,
        ); // 10m
        saveRate(
          pool,
          alToken.address,
          BigInt.fromI32(0),
          Address.fromString(pairedAssets[i]),
          BigInt.fromI32(i),
          BigInt.fromI32(50000000).times(BigInt.fromI32(10).pow(dec as u8)),
          event,
        ); // 50m
        // if (pool.id === '0xc4c319e2d4d66cca4464c0c2b32c9bd23ebe784e') {
        //   saveRate(pool, underlyingCoins![0], BigInt.fromI32(0), underlyingCoins![i], BigInt.fromI32(i), BigInt.fromI32(1000).times(BigInt.fromI32(10).pow(dec as u8)), event) // 1m
        //   saveRate(pool, underlyingCoins![0], BigInt.fromI32(0), underlyingCoins![i], BigInt.fromI32(i), BigInt.fromI32(5000).times(BigInt.fromI32(10).pow(dec as u8)), event) // 1m
        //   saveRate(pool, underlyingCoins![0], BigInt.fromI32(0), underlyingCoins![i], BigInt.fromI32(i), BigInt.fromI32(10000).times(BigInt.fromI32(10).pow(dec as u8)), event) // 1m
        // } else if (pool.id === '0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c') {
        //   saveRate(pool, underlyingCoins![0], BigInt.fromI32(0), underlyingCoins![i], BigInt.fromI32(i), BigInt.fromI32(1000000).times(BigInt.fromI32(10).pow(dec as u8)), event) // 1m
        //   saveRate(pool, underlyingCoins![0], BigInt.fromI32(0), underlyingCoins![i], BigInt.fromI32(i), BigInt.fromI32(10000000).times(BigInt.fromI32(10).pow(dec as u8)), event) // 10m
        //   saveRate(pool, underlyingCoins![0], BigInt.fromI32(0), underlyingCoins![i], BigInt.fromI32(i), BigInt.fromI32(50000000).times(BigInt.fromI32(10).pow(dec as u8)), event) // 50m
        // }
      }

      let coin = new UnderlyingCoin(pool.id + '-' + i.toString());
      coin.index = i;
      coin.pool = pool.id;
      coin.token = token.id;
      coin.coin = coin.id;
      // coin.balance = balances ? decimal.fromBigInt(balances![i]) : decimal.ZERO
      coin.balance = decimal.ZERO;
      coin.updated = event.block.timestamp;
      coin.updatedAtBlock = event.block.number;
      coin.updatedAtTransaction = event.transaction.hash;
      coin.save();
    }
  }
}

export function saveRate(
  pool: Pool,
  inputToken: Bytes,
  inputIdx: BigInt,
  outputToken: Bytes,
  outputIdx: BigInt,
  inputAmount: BigInt,
  event: ethereum.Event,
): void {
  let swapContract = MetaPool.bind(pool.swapAddress as Address);
  let outputAmount = swapContract.get_dy_underlying(inputIdx, outputIdx, inputAmount);
  let id = pool.id + '/' + inputToken.toHex() + '/' + outputToken.toHex() + '/' + inputAmount.toString();
  let rate = PoolRate.load(id);
  if (!rate) {
    rate = new PoolRate(id);
    rate.pool = pool.id;
    rate.inputToken = inputToken;
    rate.outputToken = outputToken;
    rate.inputAmount = inputAmount;
  }
  rate.outputAmount = outputAmount;
  rate.save();

  saveHistoricalPoolRate(rate as PoolRate, event);
}

export function saveHistoricalPoolRate(rate: PoolRate, event: ethereum.Event): void {
  let id = rate.id + '/' + event.block.number.toString() + '/' + event.transaction.index.toString();
  let historicalPoolRate = PoolHistoricalRate.load(id);
  if (!historicalPoolRate) {
    historicalPoolRate = new PoolHistoricalRate(id);
    historicalPoolRate.rate = rate.id;
    historicalPoolRate.block = event.block.number;
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
