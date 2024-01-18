// import { Address, Entity, ethereum, BigInt } from '@graphprotocol/graph-ts';
// import {
//   AdminUpdated,
//   BurnMetaPoolTokens,
//   ClaimRewards,
//   DepositMetaPoolTokens,
//   MetaPoolSlippageUpdated,
//   MintMetaPoolTokens,
//   MintMetaPoolTokens1,
//   OperatorUpdated,
//   PendingAdminUpdated,
//   ReclaimEth,
//   RewardReceiverUpdated,
//   TransmuterBufferUpdated,
//   WithdrawMetaPoolTokens,
// } from '../generated/EthAssetManager/EthAssetManager';
// import {
//   EthAssetManager,
//   EthAssetManagerAdminUpdatedEvent,
//   EthAssetManagerBurnMetaPoolTokensEvent,
//   EthAssetManagerClaimRewardsEvent,
//   EthAssetManagerDepositMetaPoolTokensEvent,
//   EthAssetManagerMetaPoolSlippageUpdatedEvent,
//   EthAssetManagerMintMetaPoolTokensEvent,
//   EthAssetManagerOperatorUpdatedEvent,
//   EthAssetManagerPendingAdminUpdatedEvent,
//   EthAssetManagerReclaimEthEvent,
//   EthAssetManagerRewardReceiverUpdatedEvent,
//   EthAssetManagerTransmuterBufferUpdatedEvent,
//   EthAssetManagerWithdrawMetaPoolTokensEvent,
// } from '../generated/schema';
// import { CONVEX_TOKEN, CURVE_TOKEN, ETH_META_POOL_ASSETS } from '../utils/constants';
// import {
//   createEvent,
//   getOrCreateEthAssetManagerMetaPoolTokenBalanceHistory,
//   getOrCreateEthAssetManagerRewardsHistory,
//   getOrCreateEthAssetManagerTokenBalance,
//   getOrCreateUnderlyingToken,
// } from '../utils/entities';

// function getOrCreateEthAssetManager(event: ethereum.Event): EthAssetManager {
//   let entity = EthAssetManager.load(event.address.toHex());

//   if (!entity) {
//     entity = new EthAssetManager(event.address.toHex());
//     entity.save();
//   }

//   return entity;
// }

// function createEthAssetManagerEvent<TEvent extends Entity>(event: ethereum.Event): TEvent {
//   const contract = getOrCreateEthAssetManager(event);
//   const entity = createEvent<TEvent>(event);
//   entity.setString('contract', contract.id);

//   return entity;
// }

// export function handleAdminUpdated(event: AdminUpdated): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerAdminUpdatedEvent>(event);
//   entity.admin = event.params.admin;
//   entity.save();
// }

// export function handlePendingAdminUpdated(event: PendingAdminUpdated): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerPendingAdminUpdatedEvent>(event);
//   entity.pendingAdmin = event.params.pendingAdmin;
//   entity.save();
// }

// export function handleOperatorUpdated(event: OperatorUpdated): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerOperatorUpdatedEvent>(event);
//   entity.operator = event.params.operator;
//   entity.save();
// }

// export function handleRewardReceiverUpdated(event: RewardReceiverUpdated): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerRewardReceiverUpdatedEvent>(event);
//   entity.rewardReceiver = event.params.rewardReceiver;
//   entity.save();
// }

// export function handleTransmuterBufferUpdated(event: TransmuterBufferUpdated): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerTransmuterBufferUpdatedEvent>(event);
//   entity.transmuterBuffer = event.params.transmuterBuffer;
//   entity.save();
// }

// export function handleMetaPoolSlippageUpdated(event: MetaPoolSlippageUpdated): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerMetaPoolSlippageUpdatedEvent>(event);
//   entity.metaPoolSlippage = event.params.metaPoolSlippage;
//   entity.save();
// }

// export function handleMintMetaPoolTokens(event: MintMetaPoolTokens): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerMintMetaPoolTokensEvent>(event);
//   entity.amounts = event.params.amounts;
//   entity.mintedThreePoolTokens = event.params.mintedThreePoolTokens;
//   entity.save();
// }

// export function handleMintMetaPoolTokens1(event: MintMetaPoolTokens1): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerMintMetaPoolTokensEvent>(event);
//   entity.asset = event.params.asset;
//   entity.amount = event.params.amount;
//   entity.minted = event.params.minted;
//   entity.save();
// }

// export function handleBurnMetaPoolTokens(event: BurnMetaPoolTokens): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerBurnMetaPoolTokensEvent>(event);
//   entity.asset = event.params.asset;
//   entity.amount = event.params.amount;
//   entity.withdrawn = event.params.withdrawn;
//   entity.save();

//   const ethAssetManager = getOrCreateEthAssetManager(event);
//   const metaPoolToken = getOrCreateUnderlyingToken(Address.fromString(ETH_META_POOL_ASSETS[event.params.asset]));
//   const token = getOrCreateEthAssetManagerTokenBalance(ethAssetManager, metaPoolToken);
//   token.amount = token.amount.minus(event.params.amount);
//   token.save();

//   getOrCreateEthAssetManagerMetaPoolTokenBalanceHistory(token, event.params.amount.times(BigInt.fromI32(-1)), event);
// }

// export function handleWithdrawMetaPoolTokens(event: WithdrawMetaPoolTokens): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerWithdrawMetaPoolTokensEvent>(event);
//   entity.amount = event.params.amount;
//   entity.success = event.params.success;
//   entity.save();

//   const ethAssetManager = getOrCreateEthAssetManager(event);
//   const metaPoolToken = getOrCreateUnderlyingToken(Address.fromString(ETH_META_POOL_ASSETS[0]));
//   const token = getOrCreateEthAssetManagerTokenBalance(ethAssetManager, metaPoolToken);
//   token.amount = token.amount.plus(event.params.amount);
//   token.save();

//   getOrCreateEthAssetManagerMetaPoolTokenBalanceHistory(token, event.params.amount, event);
// }

// export function handleDepositMetaPoolTokens(event: DepositMetaPoolTokens): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerDepositMetaPoolTokensEvent>(event);
//   entity.amount = event.params.amount;
//   entity.success = event.params.success;
//   entity.save();

//   const ethAssetManager = getOrCreateEthAssetManager(event);
//   const metaPoolToken = getOrCreateUnderlyingToken(Address.fromString(ETH_META_POOL_ASSETS[1]));
//   const token = getOrCreateEthAssetManagerTokenBalance(ethAssetManager, metaPoolToken);
//   token.amount = token.amount.minus(event.params.amount);
//   token.save();

//   getOrCreateEthAssetManagerMetaPoolTokenBalanceHistory(token, event.params.amount.times(BigInt.fromI32(-1)), event);
// }

// export function handleClaimRewards(event: ClaimRewards): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerClaimRewardsEvent>(event);
//   entity.success = event.params.success;
//   entity.amountCurve = event.params.amountCurve;
//   entity.amountConvex = event.params.amountConvex;
//   entity.save();

//   const ethAssetManager = getOrCreateEthAssetManager(event);
//   const curveToken = getOrCreateUnderlyingToken(Address.fromString(CURVE_TOKEN));
//   const curveState = getOrCreateEthAssetManagerTokenBalance(ethAssetManager, curveToken);
//   const convexToken = getOrCreateUnderlyingToken(Address.fromString(CONVEX_TOKEN));
//   const convexState = getOrCreateEthAssetManagerTokenBalance(ethAssetManager, convexToken);
//   curveState.amount = curveState.amount.plus(event.params.amountCurve);
//   convexState.amount = convexState.amount.plus(event.params.amountConvex);
//   curveState.save();
//   convexState.save();

//   getOrCreateEthAssetManagerRewardsHistory(
//     curveState,
//     convexState,
//     event.params.amountCurve,
//     event.params.amountConvex,
//     event,
//   );
// }

// export function handleReclaimEth(event: ReclaimEth): void {
//   const entity = createEthAssetManagerEvent<EthAssetManagerReclaimEthEvent>(event);
//   entity.amount = event.params.amount;
//   entity.save();

//   const threePoolAssetManager = getOrCreateEthAssetManager(event);
//   const threePoolToken = getOrCreateUnderlyingToken(Address.fromString(ETH_META_POOL_ASSETS[0]));
//   const token = getOrCreateEthAssetManagerTokenBalance(threePoolAssetManager, threePoolToken);
//   token.amount = token.amount.minus(event.params.amount);
//   token.save();

//   getOrCreateEthAssetManagerMetaPoolTokenBalanceHistory(token, event.params.amount.times(BigInt.fromI32(-1)), event);
// }
