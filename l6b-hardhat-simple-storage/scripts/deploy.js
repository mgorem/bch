// imports
const { ethers, run, network } = require("hardhat")

// async main function
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying Contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Deployed Contract to ${simpleStorage.address}`)
    if (network.config.chainId && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
}

// Verification function
async function verify(contractAddress, args) {
    console.log("Verifying Contract...")
    try {
        await run("verify: verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (err) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified")
        } else {
            console.log(err)
        }
    }
}

// call main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
