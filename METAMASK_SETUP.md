# MetaMask Setup Guide for GrowLedger Bloom

## What is MetaMask?

MetaMask is a cryptocurrency wallet that runs in your browser and allows you to interact with blockchain applications like GrowLedger Bloom. It securely stores your Ethereum wallet credentials and lets you sign blockchain transactions.

## Step 1: Install MetaMask

1. Visit [metamask.io](https://metamask.io/)
2. Click **Download** and select your browser (Chrome, Firefox, Brave, or Edge)
3. Add the MetaMask extension to your browser
4. Click on the MetaMask fox icon in your browser toolbar

## Step 2: Create a New Wallet

1. Click **Get Started**
2. Select **Create a New Wallet**
3. Agree to the terms and conditions
4. Create a strong password for MetaMask
5. Click **Create a New Wallet**

## Step 3: Secure Your Wallet

### CRITICAL: Save Your Secret Recovery Phrase

1. MetaMask will show you a **Secret Recovery Phrase** (12 words)
2. **Write these words down on paper in order**
3. Store this paper in a safe, secure location
4. **NEVER share these words with anyone**
5. **NEVER enter them on any website**

⚠️ **WARNING**: Anyone with your Secret Recovery Phrase can access your wallet and steal your funds!

## Step 4: Verify Your Recovery Phrase

1. MetaMask will ask you to confirm your recovery phrase
2. Select the words in the correct order
3. Click **Confirm**

## Step 5: Connect to GrowLedger Bloom

1. Open the GrowLedger Bloom application
2. Look for the **Web3 Wallet** section
3. Click **Connect Wallet**
4. MetaMask will pop up asking for permission
5. Click **Connect** to authorize the connection
6. Your wallet address will now be displayed

## Understanding Your Wallet

### Wallet Address
- Your unique identifier on the blockchain (looks like: `0x742d...5e4f`)
- Safe to share publicly
- Used to receive cryptocurrency or view your blockchain records

### Balance
- Shows how much cryptocurrency you have (ETH on Ethereum)
- Required to pay for blockchain transactions (gas fees)

### Network
- Different blockchains (Ethereum Mainnet, Sepolia Testnet, etc.)
- Switch networks using the dropdown at the top of MetaMask
- **For Testing**: Use Sepolia or Goerli testnet to avoid spending real money

## Using MetaMask with GrowLedger

### Recording Plant Growth on Blockchain

1. Add a growth record in your plant details
2. Click **Record on Blockchain** (when implemented)
3. MetaMask will pop up with a transaction
4. Review the gas fee (transaction cost)
5. Click **Confirm** to submit to the blockchain
6. Wait for confirmation (usually 15-30 seconds)

### Viewing Blockchain Records

1. Click on any plant card
2. Go to the **Blockchain** tab
3. View all growth records with blockchain verification
4. Click **Verify Blockchain Integrity** to check authenticity

## Getting Test ETH (For Development)

If you're using a testnet, you'll need test ETH:

### Sepolia Testnet Faucets
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

1. Copy your wallet address from MetaMask
2. Paste it into a faucet website
3. Complete any verification (captcha, etc.)
4. Wait for test ETH to arrive (usually instant)

## Security Best Practices

✅ **DO:**
- Keep your Secret Recovery Phrase offline and secure
- Use a strong, unique password
- Lock MetaMask when not in use
- Verify website URLs before connecting
- Start with testnets before using real ETH

❌ **DON'T:**
- Share your Secret Recovery Phrase with anyone
- Store your phrase digitally (screenshots, cloud storage)
- Connect to untrusted websites
- Approve transactions you don't understand
- Use the same password as other accounts

## Troubleshooting

### MetaMask Not Appearing
- Ensure the extension is enabled in your browser
- Try refreshing the page
- Check if MetaMask is locked (click the extension and unlock)

### Connection Failed
- Make sure you approved the connection in MetaMask
- Try disconnecting and reconnecting
- Check that you're on the correct network

### Transaction Failed
- Ensure you have enough ETH for gas fees
- Try increasing the gas limit
- Check network congestion and try again later

### Can't See My Balance
- Wait a few seconds for MetaMask to load
- Switch to a different network and back
- Refresh the page

## Additional Resources

- [MetaMask Official Documentation](https://support.metamask.io/)
- [Ethereum Basics](https://ethereum.org/en/wallets/)
- [What is Gas?](https://ethereum.org/en/developers/docs/gas/)
- [GrowLedger Bloom Documentation](./README.md)

## Support

If you encounter issues with MetaMask integration in GrowLedger Bloom:
1. Check the browser console for error messages
2. Ensure MetaMask is up to date
3. Try with a fresh MetaMask account on testnet
4. Review the blockchain explorer component for verification

---

**Remember**: GrowLedger Bloom uses blockchain to create an immutable record of your plant growth data. Each record is hashed and linked to previous records, creating a verifiable chain of authenticity.
