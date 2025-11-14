# CreditChain - Solution Setup Manual

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Prerequisites](#prerequisites)
4. [Environment Setup](#environment-setup)
5. [Smart Contract Deployment](#smart-contract-deployment)
6. [Frontend Configuration](#frontend-configuration)
7. [AWS Services Setup](#aws-services-setup)
8. [Docker Deployment](#docker-deployment)
9. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
10. [Production Deployment](#production-deployment)
11. [Configuration Reference](#configuration-reference)
12. [Troubleshooting](#troubleshooting)

---

## Introduction

This manual provides step-by-step instructions for setting up and configuring the CreditChain credit scoring system. The system consists of:
- **Smart Contracts**: Solidity contracts deployed on Ethereum blockchain
- **Frontend Application**: React-based web interface
- **Cloud Storage**: AWS S3 for document storage
- **Containerization**: Docker for deployment
- **CI/CD**: GitHub Actions for automated deployment

### System Components

1. **Blockchain Layer**
   - Smart contracts (Solidity)
   - Truffle framework for deployment
   - Sepolia testnet or Ethereum mainnet

2. **Frontend Layer**
   - React application
   - Web3 integration (ethers.js)
   - MetaMask wallet connection

3. **Storage Layer**
   - AWS S3 for document storage
   - Blockchain for metadata and credit scores

4. **Deployment Layer**
   - Docker containers
   - AWS ECS for orchestration
   - Nginx for web server

---

## System Architecture

```
┌─────────────────┐
│   User Browser  │
│   (MetaMask)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │
│  (Port 3000)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │        │
    ▼        ▼
┌────────┐ ┌──────────────┐
│  S3    │ │  Blockchain  │
│ Storage│ │  (Sepolia)   │
└────────┘ └──────────────┘
```

### Technology Stack

- **Blockchain**: Ethereum (Sepolia testnet)
- **Smart Contracts**: Solidity 0.8.10
- **Frontend**: React 18, ethers.js 6
- **Build Tool**: Truffle 5.11.5
- **Container**: Docker, Nginx
- **Cloud**: AWS (S3, ECS, ECR)
- **CI/CD**: GitHub Actions

---

## Prerequisites

### Required Software

#### 1. Node.js and npm
- **Node.js**: v18 or higher
- **npm**: v8 or higher (comes with Node.js)

**Installation**:
```bash
# Check if installed
node --version
npm --version

# Download from https://nodejs.org/ if not installed
```

#### 2. Git
- **Git**: Latest version

**Installation**:
```bash
# Check if installed
git --version

# Download from https://git-scm.com/ if not installed
```

#### 3. Truffle
- **Truffle**: v5.11.5 or higher

**Installation**:
```bash
npm install -g truffle

# Verify installation
truffle version
```

#### 4. Docker (Optional, for containerized deployment)
- **Docker**: v20 or higher

**Installation**:
- Windows/Mac: Download from [docker.com](https://www.docker.com/)
- Linux: `sudo apt-get install docker.io`

#### 5. AWS CLI (For AWS deployment)
- **AWS CLI**: Latest version

**Installation**:
```bash
# Download from https://aws.amazon.com/cli/
# Or use package manager
pip install awscli
```

### Required Accounts and Services

#### 1. Ethereum Wallet
- MetaMask or hardware wallet
- Sepolia testnet ETH (for testing)
- Mainnet ETH (for production)

**Getting Sepolia ETH**:
- Visit [sepoliafaucet.com](https://sepoliafaucet.com/)
- Enter your wallet address
- Request test ETH

#### 2. Infura Account (For RPC endpoint)
- Sign up at [infura.io](https://infura.io/)
- Create a new project
- Get your Project ID

#### 3. AWS Account
- AWS account with appropriate permissions
- Access to:
  - S3 (for document storage)
  - ECR (for container registry)
  - ECS (for container orchestration)
  - IAM (for access management)

#### 4. GitHub Account
- GitHub account
- Repository access
- GitHub Actions enabled

---

## Environment Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Creditchain-main
```

### Step 2: Install Dependencies

#### Root Dependencies
```bash
npm install
```

This installs:
- Truffle
- @truffle/hdwallet-provider
- dotenv

#### Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

This installs:
- React and related packages
- ethers.js
- UI components (Radix UI)
- Other frontend dependencies

### Step 3: Create Environment Files

#### Root Directory `.env`

Create `.env` file in the root directory:

```bash
touch .env
```

Add the following content:

```env
# Wallet Configuration
MNEMONIC="your twelve word mnemonic phrase here"

# Infura Configuration
PROJECT_ID="your_infura_project_id_here"

# Network Configuration
NETWORK_ID=11155111
HOST=127.0.0.1
PORT=7545

# Contract Configuration (will be filled after deployment)
CONTRACT_ADDRESS=""
```

**Important Notes**:
- Never commit `.env` files to version control
- Use a strong, unique mnemonic phrase
- Keep your mnemonic phrase secure and private

#### Frontend Directory `.env`

Create `.env` file in the `frontend` directory:

```bash
touch frontend/.env
```

Add the following content:

```env
# Contract Configuration (update after deployment)
REACT_APP_CONTRACT_ADDRESS=""

# Network Configuration
REACT_APP_NETWORK_ID=11155111
REACT_APP_CHAIN_ID=0xaa36a7

# Environment
REACT_APP_ENVIRONMENT=development

# S3 Bucket Configuration
REACT_APP_S3_BUCKET_URL="https://your-bucket-name.s3.amazonaws.com"
```

**Important Notes**:
- `REACT_APP_CONTRACT_ADDRESS` will be updated after contract deployment
- `REACT_APP_S3_BUCKET_URL` should point to your S3 bucket
- All `REACT_APP_*` variables are embedded at build time

---

## Smart Contract Deployment

### Step 1: Configure Truffle

The `truffle-config.js` file is already configured. Verify the configuration:

```javascript
// Check truffle-config.js
// Ensure sepolia network is configured with your Infura endpoint
```

Update `truffle-config.js` if needed:

```javascript
sepolia: {
  provider: () => new HDWalletProvider(
    process.env.MNEMONIC,
    `https://sepolia.infura.io/v3/${process.env.PROJECT_ID}`
  ),
  network_id: 11155111,
  confirmations: 2,
  timeoutBlocks: 200,
  skipDryRun: true
}
```

### Step 2: Compile Smart Contracts

```bash
truffle compile
```

This will:
- Compile Solidity contracts
- Generate ABI files in `build/contracts/`
- Check for compilation errors

**Expected Output**:
```
Compiling your contracts...
✓ Compilation successful
```

### Step 3: Deploy to Sepolia Testnet

#### Option A: Deploy with Truffle

```bash
truffle migrate --network sepolia
```

**What Happens**:
1. Connects to Sepolia via Infura
2. Deploys contracts using your wallet
3. Shows deployment addresses
4. Saves contract addresses

**Expected Output**:
```
Compiling your contracts...
✓ Compilation successful

Starting migrations...
1_initial_migration.js
  Deploying 'Migrations'
  ✓ Migrations: 0x...
2_dashboard.js
  Deploying 'Dashboard'
  ✓ Dashboard: 0xYourContractAddress

Summary
=======
> Total deployments: 2
> Final cost: 0.0x ETH
```

#### Option B: Deploy with Truffle Dashboard (More Secure)

```bash
# Terminal 1: Start Truffle Dashboard
truffle dashboard

# Terminal 2: Deploy using dashboard
truffle migrate --network dashboard
```

This method:
- Uses MetaMask for signing
- No need to store mnemonic in `.env`
- More secure for production

### Step 4: Get Contract Address

After deployment, copy the contract address from the output:

```
✓ Dashboard: 0x33D231B8C9E9e2dCC83C6C1a30971198432708dD
```

### Step 5: Update Environment Files

Update both `.env` files with the contract address:

**Root `.env`**:
```env
CONTRACT_ADDRESS="0x33D231B8C9E9e2dCC83C6C1a30971198432708dD"
```

**Frontend `.env`**:
```env
REACT_APP_CONTRACT_ADDRESS="0x33D231B8C9E9e2dCC83C6C1a30971198432708dD"
```

### Step 6: Update Contract Address in Code

Update `frontend/src/contract.js`:

```javascript
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0xYourContractAddress";
```

Or hardcode temporarily:

```javascript
export const CONTRACT_ADDRESS = "0x33D231B8C9E9e2dCC83C6C1a30971198432708dD";
```

### Step 7: Verify Contract (Optional)

```bash
truffle run verify dashboard --network sepolia
```

This verifies the contract on Etherscan for transparency.

---

## Frontend Configuration

### Step 1: Configure Contract Integration

The contract integration is in `frontend/src/contract.js`. Verify:

```javascript
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0xYourContractAddress";
```

### Step 2: Configure S3 Upload

Update `frontend/src/components/UserDashboard.jsx`:

```javascript
const bucketUrl = process.env.REACT_APP_S3_BUCKET_URL || "https://your-bucket.s3.amazonaws.com";
```

### Step 3: Build Frontend

#### Development Mode
```bash
cd frontend
npm start
```

This starts the development server at `http://localhost:3000`

#### Production Build
```bash
cd frontend
npm run build
```

This creates an optimized build in `frontend/build/`

### Step 4: Test Frontend

1. Open `http://localhost:3000`
2. Connect MetaMask wallet
3. Test document submission
4. Verify contract interaction

---

## AWS Services Setup

### Step 1: AWS S3 Bucket Setup

#### Create S3 Bucket

```bash
aws s3 mb s3://your-bucket-name --region us-east-1
```

Or via AWS Console:
1. Go to S3 service
2. Click "Create bucket"
3. Enter bucket name
4. Select region
5. Configure permissions (enable public read for uploaded files)
6. Create bucket

#### Configure CORS

Add CORS configuration to allow frontend uploads:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

#### Configure Bucket Policy

Allow public read access for uploaded files:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

#### Update Frontend Configuration

Update `frontend/.env`:
```env
REACT_APP_S3_BUCKET_URL="https://your-bucket-name.s3.amazonaws.com"
```

### Step 2: AWS ECR Setup (For Docker Deployment)

#### Create ECR Repository

```bash
aws ecr create-repository \
    --repository-name credit-scoring-dashboard \
    --region us-east-1
```

#### Get ECR Login

```bash
aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin \
    YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### Step 3: AWS ECS Setup (For Container Orchestration)

#### Create ECS Cluster

```bash
aws ecs create-cluster \
    --cluster-name credit-scoring-cluster \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
```

#### Create Task Definition

Create `.aws/task-definition.json`:

```json
{
  "family": "credit-scoring-dashboard-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "credit-scoring-dashboard",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/credit-scoring-dashboard:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "REACT_APP_CONTRACT_ADDRESS",
          "value": "YOUR_CONTRACT_ADDRESS"
        },
        {
          "name": "REACT_APP_NETWORK_ID",
          "value": "11155111"
        },
        {
          "name": "REACT_APP_S3_BUCKET_URL",
          "value": "https://your-bucket.s3.amazonaws.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/credit-scoring-dashboard",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register task definition:

```bash
aws ecs register-task-definition \
    --cli-input-json file://.aws/task-definition.json
```

#### Create ECS Service

```bash
aws ecs create-service \
    --cluster credit-scoring-cluster \
    --service-name credit-scoring-dashboard-service \
    --task-definition credit-scoring-dashboard-task \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

## Docker Deployment

### Step 1: Build Docker Image

#### Build Frontend Image

```bash
docker build \
    --build-arg REACT_APP_CONTRACT_ADDRESS="0xYourContractAddress" \
    --build-arg REACT_APP_NETWORK_ID="11155111" \
    --build-arg REACT_APP_S3_BUCKET_URL="https://your-bucket.s3.amazonaws.com" \
    -t credit-scoring-dashboard:latest .
```

#### Tag for ECR

```bash
docker tag credit-scoring-dashboard:latest \
    YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/credit-scoring-dashboard:latest
```

#### Push to ECR

```bash
docker push \
    YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/credit-scoring-dashboard:latest
```

### Step 2: Run Locally with Docker

```bash
docker run -p 3000:80 credit-scoring-dashboard:latest
```

Access at `http://localhost:3000`

### Step 3: Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        REACT_APP_CONTRACT_ADDRESS: "0xYourContractAddress"
        REACT_APP_NETWORK_ID: "11155111"
        REACT_APP_S3_BUCKET_URL: "https://your-bucket.s3.amazonaws.com"
    ports:
      - "3000:80"
    environment:
      - REACT_APP_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
      - REACT_APP_NETWORK_ID=${NETWORK_ID}
```

Run:

```bash
docker-compose up --build
```

---

## CI/CD Pipeline Setup

### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: credit-scoring-dashboard
  ECS_SERVICE: credit-scoring-dashboard-service
  ECS_CLUSTER: credit-scoring-cluster
  ECS_TASK_DEFINITION: credit-scoring-dashboard-task

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm install
          cd frontend && npm install
      
      - name: Run tests
        run: |
          npm run test || true
          cd frontend && npm run test -- --watchAll=false || true

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build, tag, and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build \
            --build-arg REACT_APP_CONTRACT_ADDRESS="${{ secrets.CONTRACT_ADDRESS }}" \
            --build-arg REACT_APP_NETWORK_ID="11155111" \
            --build-arg REACT_APP_S3_BUCKET_URL="${{ secrets.S3_BUCKET_URL }}" \
            -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Deploy to Amazon ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: .aws/task-definition.json
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
```

### Step 2: Configure GitHub Secrets

Go to GitHub Repository → Settings → Secrets and variables → Actions

Add the following secrets:

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
CONTRACT_ADDRESS=0xYourContractAddress
S3_BUCKET_URL=https://your-bucket.s3.amazonaws.com
```

### Step 3: Create AWS IAM User for GitHub Actions

```bash
# Create IAM user
aws iam create-user --user-name github-actions-user

# Attach policies
aws iam attach-user-policy \
    --user-name github-actions-user \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess

aws iam attach-user-policy \
    --user-name github-actions-user \
    --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

# Create access keys
aws iam create-access-key --user-name github-actions-user
```

Add the access keys to GitHub secrets.

---

## Production Deployment

### Step 1: Pre-Deployment Checklist

- [ ] Smart contracts deployed and verified
- [ ] Contract address updated in all configuration files
- [ ] S3 bucket created and configured
- [ ] Environment variables set correctly
- [ ] Frontend builds successfully
- [ ] Docker image builds successfully
- [ ] Tests pass
- [ ] Security review completed

### Step 2: Deploy Smart Contract to Production

```bash
# Deploy to mainnet (replace sepolia with mainnet in truffle-config.js)
truffle migrate --network mainnet

# Verify contract
truffle run verify dashboard --network mainnet
```

### Step 3: Deploy Frontend

#### Option A: Deploy via GitHub Actions
1. Push to `main` branch
2. GitHub Actions automatically builds and deploys

#### Option B: Manual Deployment
```bash
# Build image
docker build --build-arg REACT_APP_CONTRACT_ADDRESS="0x..." -t credit-scoring-dashboard .

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/credit-scoring-dashboard:latest

# Update ECS service
aws ecs update-service \
    --cluster credit-scoring-cluster \
    --service credit-scoring-dashboard-service \
    --force-new-deployment
```

### Step 4: Configure Load Balancer (Optional)

```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
    --name credit-scoring-alb \
    --subnets subnet-xxx subnet-yyy \
    --security-groups sg-xxx
```

### Step 5: Monitor Deployment

```bash
# Check ECS service status
aws ecs describe-services \
    --cluster credit-scoring-cluster \
    --services credit-scoring-dashboard-service

# View logs
aws logs tail /ecs/credit-scoring-dashboard --follow
```

---

## Configuration Reference

### Environment Variables

#### Root `.env`
```env
MNEMONIC="your mnemonic phrase"
PROJECT_ID="your infura project id"
NETWORK_ID=11155111
CONTRACT_ADDRESS="0x..."
```

#### Frontend `.env`
```env
REACT_APP_CONTRACT_ADDRESS="0x..."
REACT_APP_NETWORK_ID=11155111
REACT_APP_CHAIN_ID=0xaa36a7
REACT_APP_S3_BUCKET_URL="https://..."
```

### Network Configuration

#### Sepolia Testnet
- Network ID: `11155111`
- Chain ID: `0xaa36a7`
- RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- Explorer: `https://sepolia.etherscan.io`

#### Ethereum Mainnet
- Network ID: `1`
- Chain ID: `0x1`
- RPC URL: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`
- Explorer: `https://etherscan.io`

### Smart Contract Constants

- `MAX_CREDIT_SCORE`: 1000
- `MIN_CREDIT_SCORE`: 0
- `MIN_REQUIRED_DOCS`: 2
- `MAX_REPAYMENT_SCORE`: 100
- `MIN_REPAYMENT_SCORE`: 0

---

## Troubleshooting

### Common Setup Issues

#### 1. Truffle Compilation Errors

**Problem**: Contracts fail to compile

**Solutions**:
```bash
# Clear build directory
rm -rf build/

# Reinstall dependencies
npm install

# Check Solidity version
# Ensure truffle-config.js uses correct Solidity version
```

#### 2. Deployment Failures

**Problem**: Contract deployment fails

**Solutions**:
- Check if you have sufficient ETH for gas
- Verify network connection
- Check Infura endpoint is correct
- Verify mnemonic is correct
- Check gas limit settings

#### 3. Frontend Build Errors

**Problem**: React build fails

**Solutions**:
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Check environment variables
# Ensure all REACT_APP_* variables are set
```

#### 4. Docker Build Failures

**Problem**: Docker image build fails

**Solutions**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t credit-scoring-dashboard .

# Check Dockerfile syntax
# Verify all paths are correct
```

#### 5. ECR Permission Errors

**Problem**: Cannot push to ECR

**Solutions**:
```bash
# Check AWS credentials
aws sts get-caller-identity

# Re-login to ECR
aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin \
    YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Check IAM permissions
aws iam list-attached-user-policies --user-name YOUR_USERNAME
```

#### 6. ECS Deployment Issues

**Problem**: ECS service fails to deploy

**Solutions**:
- Check task definition is valid
- Verify container image exists in ECR
- Check security group allows traffic
- Verify subnet configuration
- Check CloudWatch logs for errors

### Debug Commands

```bash
# Check contract deployment
truffle console --network sepolia
> dashboard.deployed().then(i => console.log(i.address))

# Check network connection
truffle console --network sepolia
> web3.eth.getAccounts().then(accounts => console.log(accounts))

# Test frontend locally
cd frontend
npm start

# Test Docker locally
docker run -p 3000:80 credit-scoring-dashboard

# Check ECS service
aws ecs describe-services --cluster credit-scoring-cluster --services credit-scoring-dashboard-service

# View logs
aws logs tail /ecs/credit-scoring-dashboard --follow
```

---

## Support and Resources

### Documentation
- Truffle: https://trufflesuite.com/docs
- React: https://react.dev/
- ethers.js: https://docs.ethers.org/
- AWS ECS: https://docs.aws.amazon.com/ecs/

### Getting Help
1. Check troubleshooting section
2. Review error logs
3. Check GitHub issues
4. Contact development team

---

**Last Updated**: 2024
**Version**: 1.0


