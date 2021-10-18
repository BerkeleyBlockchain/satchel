async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const UnicefSatchel = await ethers.getContractFactory("UnicefSatchel");
    const unicefSatchel = await UnicefSatchel.deploy();
  
    console.log("unicefSatchel address:", unicefSatchel.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });