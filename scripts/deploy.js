const hre = require("hardhat");
const fs = require('fs');
require("dotenv").config();

const { PUBLIC_KEY } = process.env

async function main() {
  // const Minter = await hre.ethers.getContractFactory("Minter");
  // const minter = await Minter.deploy();

  const MegaFansNFT = await hre.ethers.getContractFactory("MegaFansNFT");
  const megafansnft = await MegaFansNFT.deploy();
  const StakingSystem = await hre.ethers.getContractFactory("StakingSystem");
  const stakingsystem = await StakingSystem.deploy(`${megafansnft.address}`);

  await megafansnft.deployed();  
  await stakingsystem.deployed();

  await megafansnft.setApprovalForAll(
    stakingsystem.address,
    true
  )

  console.log("MegaFansNFT deployed to:", megafansnft.address);
  console.log("StakingSystem deployed to:", stakingsystem.address);
  
  fs.writeFileSync('./config.js', `
    export const MegaFansNFTAddress = "${megafansnft.address}"
    export const StakingSystemAddress = "${stakingsystem.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
