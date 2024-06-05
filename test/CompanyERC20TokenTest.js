const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { ethers, network } = require("hardhat")
const { parseUnits, formatUnits } = require("ethers")

describe("Company ERC20 Token Contract", () => {

    async function deployFixtures() {
        await network.provider.send("hardhat_reset")

        const [deployer] = await ethers.getSigners()

        const companyERC20Token = await ethers.deployContract("CompanyERC20Token", [
            "Company ERC20 Token",
            "CERCT",
            18,
            deployer.address
        ])
        await companyERC20Token.waitForDeployment()

        return {
            deployer,
            companyERC20Token
        }
    }

    it("should have the name `Company ERC20 Token`", async() => {
        const { companyERC20Token } = await loadFixture(deployFixtures)
        expect(await companyERC20Token.name()).to.equal("Company ERC20 Token")
    })

    it("should have the symbol `CERCT`", async() => {
        const { companyERC20Token } = await loadFixture(deployFixtures)
        expect(await companyERC20Token.symbol()).to.equal("CERCT")
    })

    it("should have 77,000,000 cap on the token's total supply", async() => {
        const { companyERC20Token } = await loadFixture(deployFixtures)
        expect(await companyERC20Token.cap()).to.equal("77000000000000000000000000")
    })

    it("should only allow the owner to mint tokens and credit other accounts", async() => {
        const { companyERC20Token } = await loadFixture(deployFixtures)
        const otherAccount = "0x4cA57dbcd5815b536b3E733e4df55d5A9cFBDd4e"
        await companyERC20Token.mint(otherAccount, 333)
        expect(await companyERC20Token.balanceOf(otherAccount)).to.equal("333")
    })

    it("should allow the owner to transfer minting right to another account", async() => {
        const { deployer, companyERC20Token } = await loadFixture(deployFixtures)
        const newOwner = "0x88c6C46EBf353A52Bdbab708c23D0c81dAA8134A"
        await companyERC20Token.transferOwnership(newOwner)
        expect(await companyERC20Token.owner()).to.equal(newOwner)
        expect(await companyERC20Token.owner()).not.to.equal(deployer)
    })

})