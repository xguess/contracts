const GameChannel = artifacts.require("./GameChannel.sol");
import * as chai from 'chai';

import BlockchainLifecycle from './utils/BlockchainLifecycle';
import {configureChai, increaseTimeAsync, TRANSACTION_ERROR} from './utils/util';


configureChai();
const expect = chai.expect;

const DestroyTimeout = 20 * 24 * 60 * 60;


contract('Destroyable', accounts => {
    const owner = accounts[0];
    const notOwner = accounts[1];
    const sendTo = accounts[2];

    const blockchainLifecycle = new BlockchainLifecycle(web3.currentProvider);
    let gameChannel: any;

    before(async () => {
        gameChannel = await GameChannel.deployed();
    });

    beforeEach(async () => {
        await blockchainLifecycle.takeSnapshotAsync();
    });

    afterEach(async () => {
        await blockchainLifecycle.revertSnapShotAsync();
    });

    describe('destroy', () => {
        it('Should fail if owner calls not paused', async () => {
            return expect(gameChannel.destroy(sendTo, {from: owner})).to.be.rejectedWith(TRANSACTION_ERROR);
        });

        it('Should fail if owner calls paused with wrong timeout', async () => {
            await gameChannel.pause({from: owner});
            return expect(gameChannel.destroy(sendTo, {from: owner})).to.be.rejectedWith(TRANSACTION_ERROR);
        });

        it('Should fail if non owner calls with correct timeout', async () => {
            await gameChannel.pause({from: owner});
            await increaseTimeAsync(DestroyTimeout);
            return expect(gameChannel.destroy(sendTo, {from: notOwner})).to.be.rejectedWith(TRANSACTION_ERROR);
        });

        it('Should succeed of owner call with correct timeout', async () => {
            await gameChannel.pause({from: owner});
            await increaseTimeAsync(DestroyTimeout);
            await gameChannel.destroy(sendTo, {from: owner});
            // TODO: Add balance check
        });
    });
});
