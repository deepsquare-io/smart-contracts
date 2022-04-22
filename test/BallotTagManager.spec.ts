import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BallotTagManager, BallotTagManager__factory } from '../typings';
import setup from './testing/setup';

describe('BallotTagManager', () => {
  let owner: SignerWithAddress;
  let ballotTagManager: BallotTagManager;

  beforeEach(async () => {
    ({ owner } = await setup());
    ballotTagManager = await new BallotTagManager__factory(owner).deploy();
  });

  describe('addTag', () => {
    it('should add a tag to the tag list', async () => {
      await ballotTagManager.addTag('foo');
      expect(await ballotTagManager.getTags()).to.deep.equals(['foo']);
      await ballotTagManager.addTag('bar');
      expect(await ballotTagManager.getTags()).to.deep.equals(['foo', 'bar']);
    });
  });
});