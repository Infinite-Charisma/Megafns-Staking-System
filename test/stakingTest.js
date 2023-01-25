const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking of one nft", function () {
  it("Should stake an nft and console.log the reward for the first staking cycle", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const deployer = owner.address;
    const nullAddress = "0x0000000000000000000000000000000000000000";
    const account1 = addr1.address;
    const account2 = addr2.address;

    /// factories
    const MegaFansNFTFactory = await ethers.getContractFactory("MegaFansNFT");
    // const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
    const StakingSystemFactory = await ethers.getContractFactory("StakingSystem");

    /// @notice that the nft and the toke are being deployed
    const MegaFansNFTContract = await MegaFansNFTFactory.deploy();
    // const RewardTokenContract = await RewardTokenFactory.deploy();

    await MegaFansNFTContract.deployed();
    // await RewardTokenContract.deployed();

    // we use their address as parameters for the Staking system

    const StakingSystemContract = await StakingSystemFactory.deploy(
      MegaFansNFTContract.address
      // RewardTokenContract.address
    );

    // setting approval for all in the nft contract to the staking system contract
    console.log((StakingSystemContract.address, account1));

    await expect(
      MegaFansNFTContract.setApprovalForAll(StakingSystemContract.address, true)
    )
      .to.emit(MegaFansNFTContract, "ApprovalForAll")
      .withArgs(deployer, StakingSystemContract.address, true);

    console.log("StakingSystem deployed: ", StakingSystemContract.address);

    //mint 2 nfts
    const tokenURI_1 = "QmUsvnnoR3BgKHijhnP1qpKA7godCnBK2g4L5UknBCyiCv";
    const tokenURI_2 = "QmUsvnnoR3BgKHijhnP1qpKA7godCnBK2g4L5UknBCyiCv";

    await expect(MegaFansNFTContract.safeMint(account1, tokenURI_1))
      .to.emit(MegaFansNFTContract, "Transfer")
      .withArgs(nullAddress, account1, 1);

    expect (await MegaFansNFTContract.tokenURI(1))
      .to.equal("https://ipfs.moralis.io:2053/ipfs/QmUsvnnoR3BgKHijhnP1qpKA7godCnBK2g4L5UknBCyiCv");
    
    await expect(MegaFansNFTContract.safeMint(account1, tokenURI_2))
      .to.emit(MegaFansNFTContract, "Transfer")
      .withArgs(nullAddress, account1, 2);

    expect (await MegaFansNFTContract.tokenURI(2))
      .to.equal("https://ipfs.moralis.io:2053/ipfs/QmUsvnnoR3BgKHijhnP1qpKA7godCnBK2g4L5UknBCyiCv");
    
    //stake 1 token
    // signed by account1\

    // we need the staker to setApproval for all to the staking system contract
    await expect(
      MegaFansNFTContract.connect(addr1).setApprovalForAll(
        StakingSystemContract.address,
        true
      )
    )
      .to.emit(MegaFansNFTContract, "ApprovalForAll")
      .withArgs(account1, StakingSystemContract.address, true);

    // Stake and unstake owner account
    await expect(StakingSystemContract.connect(addr1).stake(1))
      .to.emit(StakingSystemContract, "Staked")
      .withArgs(account1, 1);

    await expect(StakingSystemContract.connect(addr1).unstake(1))
      .to.emit(StakingSystemContract, "Unstaked")
      .withArgs(account1, 1);

    // Stake with owner account and unstake & transfer to another account
    await expect(StakingSystemContract.connect(addr1).stake(2))
      .to.emit(StakingSystemContract, "Staked")
      .withArgs(account1, 2);

    await expect(StakingSystemContract.connect(addr1).unstaketoAddress(2, account2))
      .to.emit(StakingSystemContract, "UnstakedToAddress")
      .withArgs(account1, account2, 2);

    // look a way to increase time in this test

    // await network.provider.send("evm_increaseTime", [200])
    // await network.provider.send("evm_mine")
    
    //  console.log("Updating reward: ");
    //  await StakingSystemContract.connect(addr1).updateReward(account1);
    //  await StakingSystemContract.connect(addr1).claimReward(account1);
  });
});
