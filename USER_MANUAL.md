# CreditChain - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Dashboard Features](#user-dashboard-features)
4. [Submitting Documents](#submitting-documents)
5. [Viewing Credit Score](#viewing-credit-score)
6. [Document History](#document-history)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## Introduction

CreditChain is a blockchain-based credit scoring system that allows users to build their credit score by submitting and validating financial documents. The system uses smart contracts on the Ethereum blockchain to securely store and calculate credit scores based on validated documents.

### Key Features
- **Secure Document Submission**: Upload financial documents to build your credit profile
- **Transparent Credit Scoring**: View how your credit score is calculated
- **Blockchain-Based**: All data is stored securely on the blockchain
- **Real-Time Updates**: See validation status updates in real-time

### Document Types Supported
1. **Bank Statement** (Required)
   - Shows your current bank balance
   - Includes repayment history score
   - Must be validated to calculate credit score

2. **Utility Bill** (Required)
   - Shows your utility bill payments
   - Must be validated along with bank statement

3. **Salary Slip** (Optional)
   - Shows your income and employment history
   - Can boost your credit score

---

## Getting Started

### Prerequisites
Before using CreditChain, ensure you have:
- A modern web browser (Chrome, Firefox, Edge, or Safari)
- MetaMask browser extension installed
- An Ethereum wallet with some ETH for gas fees
- Access to the CreditChain application

### Installing MetaMask

1. **Download MetaMask**
   - Visit [metamask.io](https://metamask.io/)
   - Click "Download" and select your browser
   - Follow the installation instructions

2. **Create or Import Wallet**
   - Create a new wallet or import an existing one
   - **Important**: Save your seed phrase in a secure location
   - Never share your seed phrase with anyone

3. **Add Sepolia Testnet** (for testing)
   - Click the network dropdown in MetaMask
   - Select "Add Network" or "Add a network manually"
   - Enter the following details:
     - **Network Name**: Sepolia Testnet
     - **RPC URL**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID` or `https://ethereum-sepolia.publicnode.com`
     - **Chain ID**: `11155111`
     - **Currency Symbol**: `ETH`
     - **Block Explorer**: `https://sepolia.etherscan.io`

4. **Get Test ETH**
   - Visit a Sepolia faucet (e.g., [sepoliafaucet.com](https://sepoliafaucet.com/))
   - Enter your wallet address
   - Request test ETH (you'll need this for transaction gas fees)

### Connecting Your Wallet

1. **Open CreditChain Application**
   - Navigate to the CreditChain website
   - You'll see the login/wallet connection page

2. **Connect MetaMask**
   - Click the "Connect MetaMask Wallet" button
   - MetaMask will open and ask you to select an account
   - Choose your account and click "Next"
   - Click "Connect" to authorize the connection

3. **Switch Network** (if needed)
   - If you're on the wrong network, MetaMask will prompt you to switch
   - Click "Switch Network" to connect to the correct network

4. **Access Dashboard**
   - Once connected, you'll be redirected to your User Dashboard
   - You can see your current credit score and document status

---

## User Dashboard Features

The User Dashboard is your main interface for managing your credit profile. It consists of several tabs:

### Overview Tab
- **Credit Score Display**: Shows your current credit score (0-1000)
- **Score Status**: Visual indicator of your credit score range:
  - **Excellent** (800-1000): Green badge
  - **Good** (700-799): Blue badge
  - **Fair** (600-699): Yellow badge
  - **Poor** (0-599): Red badge
- **Validated Documents Count**: Number of documents that have been validated
- **Quick Stats**: Summary of your credit profile

### Submit Document Tab
- **Document Upload Form**: Submit new documents to build your credit score
- **Document Type Selection**: Choose from Bank Statement, Utility Bill, or Salary Slip
- **File Upload**: Upload your document file (PDF, JPG, PNG supported)
- **Automatic Parameter Generation**: The system automatically generates credit parameters based on your wallet address

### Document History Tab
- **All Documents**: View all documents you've submitted
- **Validation Status**: See which documents are:
  - **Pending**: Waiting for validator review
  - **Validated**: Approved and included in credit score calculation
  - **Rejected**: Not approved (if applicable)
- **Document Details**: View submission time, document type, and validation status
- **Document Hash**: Unique identifier for each document on the blockchain

---

## Submitting Documents

### Step-by-Step Guide

#### Step 1: Prepare Your Document
- Ensure your document is clear and readable
- Supported formats: PDF, JPG, PNG
- Maximum file size: 10MB (recommended)
- Make sure the document contains relevant financial information

#### Step 2: Access Submit Document Tab
1. From your User Dashboard, click on the **"Submit Document"** tab
2. You'll see the document submission form

#### Step 3: Select Document Type
1. Click on the **"Document Type"** dropdown
2. Select one of the following:
   - **Bank Statement** (Required for credit score)
   - **Utility Bill** (Required for credit score)
   - **Salary Slip** (Optional, can boost score)

#### Step 4: Upload Your File
1. Click the **"Choose File"** or **"Browse"** button
2. Navigate to your document file
3. Select the file and click "Open"
4. The file name will appear in the form

#### Step 5: Submit Document
1. Review your selection:
   - Document type is correct
   - File is selected
2. Click the **"Submit Document"** button
3. MetaMask will open asking you to confirm the transaction
4. Review the transaction details:
   - Gas fee estimate
   - Transaction data
5. Click **"Confirm"** in MetaMask
6. Wait for transaction confirmation (usually 15-30 seconds)

#### Step 6: Confirmation
- You'll see a success message: "Document submitted successfully!"
- The document will appear in your Document History with "Pending" status
- The file is automatically uploaded to secure cloud storage (S3)
- A unique hash is generated and stored on the blockchain

### What Happens After Submission?

1. **File Upload**: Your document is uploaded to secure cloud storage
2. **Blockchain Record**: A record is created on the blockchain with:
   - Document hash (unique identifier)
   - Document type
   - Submission timestamp
   - Credit parameters (generated automatically)
3. **Pending Status**: Document appears as "Pending" in your history
4. **Validator Review**: A validator will review your document
5. **Validation**: Once validated, your credit score will be recalculated

### Automatic Parameter Generation

The system automatically generates credit parameters based on:
- Your wallet address (ensures uniqueness)
- Current timestamp (ensures variation)
- Document type requirements

**Generated Parameters:**
- **Salary**: $30,000 - $100,000 (for Salary Slip)
- **Employment Years**: 1 - 15 years (for Salary Slip)
- **Repayment History Score**: 60 - 100 (for Bank Statement)
- **Current Balance**: $5,000 - $100,000 (for Bank Statement)
- **Utility Bills**: $100 - $2,000 (for Utility Bill)

**Note**: In a production system, these values would be extracted from the actual document by validators. The current system uses deterministic generation for demonstration purposes.

---

## Viewing Credit Score

### Understanding Your Credit Score

Your credit score ranges from **0 to 1000** and is calculated based on validated documents:

#### Score Ranges
- **Excellent (800-1000)**: Highest creditworthiness
- **Good (700-799)**: Good creditworthiness
- **Fair (600-699)**: Average creditworthiness
- **Poor (0-599)**: Needs improvement

### How Credit Score is Calculated

The credit score is the sum of points from validated documents:

#### Bank Statement Contribution
- **Authenticity**: 100 points (if document is authentic)
- **Repayment History**: 0-100 points (based on repayment history score)
- **Balance Points**: 0-100 points (based on current balance percentage)
  - Formula: `(balance / $100,000) × 100` (capped at 100)

#### Utility Bill Contribution
- **Authenticity**: 100 points (if document is authentic)
- **Utility Points**: 0-100 points (based on utility bill amount)
  - Formula: `(utilityAmount / $2,000) × 100` (capped at 100)

#### Salary Slip Contribution
- **Authenticity**: 100 points (if document is authentic)
- **Income Points**: 0-100 points (based on salary)
  - Formula: `(salary / $100,000) × 100` (capped at 100)
- **Employment Points**: 0-100 points (based on employment years)
  - Formula: `(employmentYears / 10) × 100` (capped at 100)

#### Final Score Calculation
```
Total Score = Bank Statement Points + Utility Bill Points + Salary Slip Points
Final Score = min(1000, Total Score)
```

**Requirements:**
- You must have at least **2 validated documents** (Bank Statement + Utility Bill)
- Only the **latest validated document** of each type is used
- Score is capped at **1000 points maximum**

### Viewing Your Score

1. **From Overview Tab**
   - Your current credit score is displayed prominently
   - Score status badge shows your credit range
   - Validated documents count is shown

2. **Score Details**
   - Click on the score to see detailed breakdown (if available)
   - View which documents contribute to your score

3. **Real-Time Updates**
   - Score updates automatically when documents are validated
   - No need to refresh the page

---

## Document History

### Accessing Document History

1. Click on the **"Document History"** tab in your dashboard
2. You'll see a table listing all your submitted documents

### Document Information Displayed

Each document shows:
- **Document Type**: Bank Statement, Utility Bill, or Salary Slip
- **Status**: Pending, Validated, or Rejected
- **Submission Time**: When you submitted the document
- **Validation Time**: When the document was validated (if applicable)
- **Document Hash**: Unique blockchain identifier
- **Credit Parameters**: Values used in credit calculation

### Understanding Document Status

#### Pending
- Document has been submitted
- Waiting for validator review
- Not yet included in credit score calculation
- Icon: Clock icon (⏰)

#### Validated
- Document has been reviewed and approved by a validator
- Included in credit score calculation
- Credit score has been updated
- Icon: Check circle icon (✓)

#### Rejected (if applicable)
- Document was not approved
- Not included in credit score
- You may need to resubmit
- Icon: X circle icon (✗)

### Document Details

Click on a document to view:
- Full document hash
- All credit parameters
- Submission and validation timestamps
- Blockchain transaction details

### Managing Documents

- **View Details**: Click on any document row to see full details
- **Resubmit**: If a document is rejected, you can submit a new one
- **Track Progress**: Monitor which documents are validated

---

## Troubleshooting

### Common Issues and Solutions

#### 1. MetaMask Not Detected
**Problem**: The application cannot detect MetaMask

**Solutions**:
- Ensure MetaMask extension is installed and enabled
- Refresh the browser page
- Check if popup blockers are preventing MetaMask from opening
- Try a different browser
- Restart your browser

#### 2. Wrong Network
**Problem**: You're connected to the wrong blockchain network

**Solutions**:
- Check the network indicator in MetaMask
- Click "Switch Network" if prompted
- Manually switch to Sepolia Testnet in MetaMask
- Verify the network details match the required network

#### 3. Transaction Failed
**Problem**: Document submission transaction fails

**Solutions**:
- Check if you have sufficient ETH for gas fees
- Ensure you're on the correct network
- Try increasing gas limit in MetaMask
- Check if the contract is deployed and accessible
- Verify your internet connection

#### 4. Document Not Appearing
**Problem**: Submitted document doesn't show in history

**Solutions**:
- Wait a few seconds for blockchain confirmation
- Refresh the page
- Check browser console for errors
- Verify the transaction was successful in MetaMask
- Check blockchain explorer for transaction status

#### 5. Credit Score Not Updating
**Problem**: Credit score doesn't update after validation

**Solutions**:
- Ensure you have at least 2 validated documents (Bank Statement + Utility Bill)
- Check if documents are actually validated (not just pending)
- Refresh the page
- Wait for blockchain state to update
- Contact support if issue persists

#### 6. File Upload Fails
**Problem**: Document file fails to upload

**Solutions**:
- Check file size (should be under 10MB)
- Verify file format (PDF, JPG, PNG)
- Check internet connection
- Try a different file
- Clear browser cache and try again

#### 7. Cannot Connect Wallet
**Problem**: Unable to connect MetaMask wallet

**Solutions**:
- Unlock MetaMask (enter password)
- Ensure MetaMask is not locked
- Check if browser extension is enabled
- Try disconnecting and reconnecting
- Clear browser cache and cookies

### Getting Help

If you encounter issues not listed here:
1. Check the browser console for error messages
2. Verify your MetaMask connection
3. Check blockchain explorer for transaction status
4. Contact support with:
   - Your wallet address
   - Transaction hash (if applicable)
   - Error message screenshot
   - Steps to reproduce the issue

---

## FAQ

### General Questions

**Q: What is CreditChain?**
A: CreditChain is a blockchain-based credit scoring system that allows users to build credit scores by submitting financial documents.

**Q: Do I need to pay to use CreditChain?**
A: You only need to pay for blockchain transaction gas fees (usually a few cents in testnet ETH). The service itself is free.

**Q: Is my data secure?**
A: Yes, all data is stored on the blockchain, which is decentralized and secure. Documents are stored in encrypted cloud storage.

**Q: Can I delete my documents?**
A: Once submitted to the blockchain, documents cannot be deleted. This ensures transparency and immutability.

### Credit Score Questions

**Q: What is the minimum credit score?**
A: The minimum credit score is 0. You need at least 2 validated documents (Bank Statement + Utility Bill) to get a score above 0.

**Q: What is the maximum credit score?**
A: The maximum credit score is 1000 points.

**Q: How often is my credit score updated?**
A: Your credit score is updated automatically whenever a document is validated by a validator.

**Q: Can I improve my credit score?**
A: Yes, you can improve your score by:
- Submitting additional documents (like Salary Slip)
- Ensuring documents are validated
- Maintaining good financial parameters

**Q: Why is my credit score 0?**
A: Your credit score is 0 if:
- You haven't submitted any documents yet
- You don't have at least 2 validated documents (Bank Statement + Utility Bill)
- Your documents are still pending validation

### Document Questions

**Q: What documents do I need?**
A: You need at minimum:
- Bank Statement (required)
- Utility Bill (required)
- Salary Slip (optional, but recommended)

**Q: How long does validation take?**
A: Validation time depends on validators. Typically, it can take a few minutes to several hours.

**Q: Can I submit multiple documents of the same type?**
A: Yes, but only the latest validated document of each type is used in credit score calculation.

**Q: What file formats are supported?**
A: PDF, JPG, and PNG formats are supported.

**Q: What is the maximum file size?**
A: Recommended maximum is 10MB, though the system may accept larger files.

### Technical Questions

**Q: Which blockchain network does CreditChain use?**
A: CreditChain uses the Sepolia testnet for testing. In production, it may use Ethereum mainnet or other networks.

**Q: Do I need to know about blockchain to use this?**
A: No, the interface is user-friendly. You just need MetaMask installed and some basic understanding of confirming transactions.

**Q: What happens if I lose my MetaMask wallet?**
A: If you lose access to your MetaMask wallet and don't have your seed phrase, you'll lose access to your credit profile. Always backup your seed phrase securely.

**Q: Can I use multiple wallets?**
A: Each wallet address is treated as a separate user. You cannot merge credit scores from different wallets.

### Privacy Questions

**Q: Who can see my documents?**
A: Only validators (authorized administrators) can view and validate your documents. Regular users cannot see other users' documents.

**Q: Is my wallet address public?**
A: Yes, wallet addresses are public on the blockchain. However, your identity is not necessarily linked to your wallet address unless you reveal it.

**Q: Can I remain anonymous?**
A: Yes, you can use CreditChain anonymously as long as you don't reveal your identity linked to your wallet address.

---

## Support

For additional support:
- Check the troubleshooting section
- Review blockchain transaction status on Etherscan
- Contact the development team
- Check GitHub issues (if applicable)

---

**Last Updated**: 2024
**Version**: 1.0


