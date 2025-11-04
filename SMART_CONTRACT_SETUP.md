# Smart Contract Integration Guide
## Crop Subsidy & Insurance Verification System

This guide will help you integrate blockchain smart contracts for tamper-proof claim verification.

---

## 📋 Prerequisites

- **Node.js** (v16+)
- **MetaMask** wallet extension
- **Hardhat** or **Truffle** for smart contract development
- **Ethereum test network** (Goerli, Sepolia, or local Hardhat network)
- **Solidity** knowledge (basic)

---

## 🚀 Step 1: Install Dependencies

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
npm install dotenv
```

Initialize Hardhat:
```bash
npx hardhat
# Choose "Create a JavaScript project"
```

---

## 📝 Step 2: Smart Contract Code

Create `contracts/CropClaim.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CropClaim {
    struct Claim {
        string plantId;
        string farmerId;
        string farmerName;
        string schemeType;  // "subsidy" or "insurance"
        uint256 claimAmount;
        bool approved;
        bool processed;
        string remarks;
        address verifier;
        uint256 submittedAt;
        uint256 processedAt;
    }

    mapping(string => Claim) public claims;
    mapping(address => bool) public authorities;
    address public owner;

    event ClaimSubmitted(string indexed plantId, string farmerId, string schemeType, uint256 amount);
    event ClaimProcessed(string indexed plantId, bool approved, string remarks, address verifier);
    event AuthorityAdded(address indexed authority);
    event AuthorityRemoved(address indexed authority);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute");
        _;
    }

    modifier onlyAuthority() {
        require(authorities[msg.sender], "Only authorities can execute");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorities[msg.sender] = true;
    }

    // Add government authority
    function addAuthority(address _authority) public onlyOwner {
        authorities[_authority] = true;
        emit AuthorityAdded(_authority);
    }

    // Remove authority
    function removeAuthority(address _authority) public onlyOwner {
        authorities[_authority] = false;
        emit AuthorityRemoved(_authority);
    }

    // Submit a claim (farmer)
    function submitClaim(
        string memory _plantId,
        string memory _farmerId,
        string memory _farmerName,
        string memory _schemeType,
        uint256 _claimAmount
    ) public {
        require(!claims[_plantId].processed, "Claim already exists");
        require(_claimAmount > 0, "Claim amount must be positive");

        claims[_plantId] = Claim({
            plantId: _plantId,
            farmerId: _farmerId,
            farmerName: _farmerName,
            schemeType: _schemeType,
            claimAmount: _claimAmount,
            approved: false,
            processed: false,
            remarks: "",
            verifier: address(0),
            submittedAt: block.timestamp,
            processedAt: 0
        });

        emit ClaimSubmitted(_plantId, _farmerId, _schemeType, _claimAmount);
    }

    // Approve a claim (authority only)
    function approveClaim(string memory _plantId, string memory _remarks) public onlyAuthority {
        Claim storage claim = claims[_plantId];
        require(bytes(claim.plantId).length > 0, "Claim does not exist");
        require(!claim.processed, "Claim already processed");

        claim.approved = true;
        claim.processed = true;
        claim.remarks = _remarks;
        claim.verifier = msg.sender;
        claim.processedAt = block.timestamp;

        emit ClaimProcessed(_plantId, true, _remarks, msg.sender);
    }

    // Reject a claim (authority only)
    function rejectClaim(string memory _plantId, string memory _remarks) public onlyAuthority {
        Claim storage claim = claims[_plantId];
        require(bytes(claim.plantId).length > 0, "Claim does not exist");
        require(!claim.processed, "Claim already processed");

        claim.approved = false;
        claim.processed = true;
        claim.remarks = _remarks;
        claim.verifier = msg.sender;
        claim.processedAt = block.timestamp;

        emit ClaimProcessed(_plantId, false, _remarks, msg.sender);
    }

    // View claim details
    function getClaim(string memory _plantId) public view returns (Claim memory) {
        return claims[_plantId];
    }

    // Check if address is authority
    function isAuthority(address _address) public view returns (bool) {
        return authorities[_address];
    }
}
```

---

## ⚙️ Step 3: Deploy Script

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying CropClaim contract...");

  const CropClaim = await hre.ethers.getContractFactory("CropClaim");
  const cropClaim = await CropClaim.deploy();

  await cropClaim.deployed();

  console.log("✅ CropClaim deployed to:", cropClaim.address);
  console.log("Save this address for frontend integration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 🌐 Step 4: Configure Hardhat

Update `hardhat.config.js`:

```javascript
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

Create `.env` file:
```
GOERLI_RPC_URL=https://goerli.infura.io/v3/YOUR_INFURA_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_metamask_private_key_here
```

---

## 🚀 Step 5: Deploy Contract

### Local Testing:
```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost
```

### Test Network (Goerli/Sepolia):
```bash
npx hardhat run scripts/deploy.js --network goerli
```

**Save the deployed contract address!**

---

## 🔗 Step 6: Frontend Integration

Create `src/utils/contractIntegration.ts`:

```typescript
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

const ABI = [
  "function submitClaim(string _plantId, string _farmerId, string _farmerName, string _schemeType, uint256 _claimAmount) public",
  "function approveClaim(string _plantId, string _remarks) public",
  "function rejectClaim(string _plantId, string _remarks) public",
  "function getClaim(string _plantId) public view returns (tuple(string plantId, string farmerId, string farmerName, string schemeType, uint256 claimAmount, bool approved, bool processed, string remarks, address verifier, uint256 submittedAt, uint256 processedAt))",
  "function isAuthority(address _address) public view returns (bool)",
  "event ClaimSubmitted(string indexed plantId, string farmerId, string schemeType, uint256 amount)",
  "event ClaimProcessed(string indexed plantId, bool approved, string remarks, address verifier)"
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

export const submitClaimToBlockchain = async (
  plantId: string,
  farmerId: string,
  farmerName: string,
  schemeType: string,
  claimAmount: number
) => {
  const contract = await getContract();
  const amountInWei = ethers.utils.parseEther(claimAmount.toString());
  const tx = await contract.submitClaim(plantId, farmerId, farmerName, schemeType, amountInWei);
  await tx.wait();
  return tx.hash;
};

export const approveClaimOnBlockchain = async (plantId: string, remarks: string) => {
  const contract = await getContract();
  const tx = await contract.approveClaim(plantId, remarks);
  await tx.wait();
  return tx.hash;
};

export const rejectClaimOnBlockchain = async (plantId: string, remarks: string) => {
  const contract = await getContract();
  const tx = await contract.rejectClaim(plantId, remarks);
  await tx.wait();
  return tx.hash;
};

export const getClaimFromBlockchain = async (plantId: string) => {
  const contract = await getContract();
  return await contract.getClaim(plantId);
};
```

---

## 🔧 Step 7: Update Frontend Components

### In `ClaimSubmission.tsx`:

```typescript
import { submitClaimToBlockchain } from '@/utils/contractIntegration';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  setSubmitting(true);
  try {
    // Submit to blockchain
    const txHash = await submitClaimToBlockchain(
      selectedPlant,
      user.uid,
      user.email || 'Unknown',
      schemeType,
      parseFloat(claimAmount)
    );
    
    // Then submit to Firebase
    await submitClaim(selectedPlant, plant.name, schemeType, parseFloat(claimAmount));
    
    toast.success("Claim submitted to blockchain!", {
      description: `Transaction: ${txHash.slice(0, 10)}...`
    });
  } catch (error) {
    toast.error("Blockchain submission failed");
  } finally {
    setSubmitting(false);
  }
};
```

### In `AuthorityClaimApproval.tsx`:

```typescript
import { approveClaimOnBlockchain, rejectClaimOnBlockchain } from '@/utils/contractIntegration';

const handleProcess = async (claimId: string, status: ClaimStatus) => {
  try {
    const claim = claims.find(c => c.id === claimId);
    
    // Process on blockchain
    if (status === 'approved') {
      await approveClaimOnBlockchain(claim.plantId, remarkText);
    } else {
      await rejectClaimOnBlockchain(claim.plantId, remarkText);
    }
    
    // Then update Firebase
    await processClaim(claimId, status, remarkText);
    
    toast.success(`Claim ${status} on blockchain!`);
  } catch (error) {
    toast.error("Blockchain verification failed");
  }
};
```

---

## 🧪 Step 8: Testing

Create `test/CropClaim.test.js`:

```javascript
const { expect } = require("chai");

describe("CropClaim", function () {
  let cropClaim, owner, authority, farmer;

  beforeEach(async function () {
    [owner, authority, farmer] = await ethers.getSigners();
    const CropClaim = await ethers.getContractFactory("CropClaim");
    cropClaim = await CropClaim.deploy();
    await cropClaim.deployed();
    
    await cropClaim.addAuthority(authority.address);
  });

  it("Should submit a claim", async function () {
    await cropClaim.connect(farmer).submitClaim(
      "plant-123",
      "farmer-1",
      "John Doe",
      "subsidy",
      ethers.utils.parseEther("100")
    );
    
    const claim = await cropClaim.getClaim("plant-123");
    expect(claim.plantId).to.equal("plant-123");
    expect(claim.processed).to.equal(false);
  });

  it("Should approve a claim by authority", async function () {
    await cropClaim.connect(farmer).submitClaim(
      "plant-456",
      "farmer-2",
      "Jane Smith",
      "insurance",
      ethers.utils.parseEther("200")
    );
    
    await cropClaim.connect(authority).approveClaim("plant-456", "Verified growth records");
    
    const claim = await cropClaim.getClaim("plant-456");
    expect(claim.approved).to.equal(true);
    expect(claim.processed).to.equal(true);
  });
});
```

Run tests:
```bash
npx hardhat test
```

---

## 📊 Step 9: Verify Contract (Optional)

For public testnets, verify your contract on Etherscan:

```bash
npx hardhat verify --network goerli YOUR_CONTRACT_ADDRESS
```

---

## 🎯 Key Benefits

✅ **Immutability** - Claims cannot be altered once submitted  
✅ **Transparency** - All transactions are publicly auditable  
✅ **Trustless Verification** - No central authority needed  
✅ **Audit Trail** - Complete history of all claims  
✅ **Tamper-Proof** - Blockchain security ensures data integrity  

---

## 🔐 Security Considerations

1. **Never expose private keys** - Use environment variables
2. **Test thoroughly** - Use testnets before mainnet
3. **Access control** - Only authorities can approve/reject
4. **Input validation** - Check all parameters before submission
5. **Event logging** - Emit events for transparency

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Ethers.js Docs](https://docs.ethers.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

---

## 🆘 Troubleshooting

**Gas fees too high?**  
→ Use Layer 2 solutions like Polygon, Optimism, or Arbitrum

**Transaction failing?**  
→ Check gas limits and ensure MetaMask is connected

**Contract not deploying?**  
→ Verify Solidity version matches compiler version

**Can't connect wallet?**  
→ Ensure MetaMask is installed and network is correct

---

**Happy Blockchain Integration! 🚀**
