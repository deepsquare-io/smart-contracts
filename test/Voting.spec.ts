import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import setup from './testing/setup';

describe('Voting', async () => {
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    ({ accounts } = await setup());
  });

  describe('addTag', () => {
    it('should add a tag to the list', async () => {

    })
  });

  describe('removeTag', () => {
    it('should throw if tag does not exist', () => {})
    it('should remove a tag from the list', () => {

    })
  });

  describe('createBallot', () => {
    it('should throw if tag does not exist', ()=> {});
    it('should create a ballot', ()=>{});
  });

  describe('closeBallot', ()=> {
    it('should throw if ballot does not exist', ()=>{});
    it('should close the ballot', ()=>{});
  });

  describe('vote', ()=>{
    it('should throw if ballot does not exist', ()=>{});
    it('should throw if ballot is closed', ()=>{});
    it('should throw if proposal does not exist', ()=>{});
    it('should vote', ()=>{});
  });

  describe('grantProxy', ()=>{
    it('should throw if tag does not exist', ()=>{});
    it('should register delegation');
  });

  describe('removeProxy', ()=>{
    it('should throw if tag does not exist', ()=>{});
    it('should throw if sender has not granted proxy for the tag', ()=>{});
    it('should remove proxy', ()=>{});
  });

  describe('showResults', ()=>{
    it('should throw of ballot does not exist', ()=>{});
    it('should throw if ballot is not closed', ()=>{});
    it('should show results', ()=>{});
  });
})