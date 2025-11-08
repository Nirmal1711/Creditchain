import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LogOut, 
  FileText, 
  Upload, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Wallet,
  Shield,
  Info,
  DollarSign,
  Briefcase,
  CreditCard,
  Receipt
} from 'lucide-react';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_NAMES } from '../contract';

const UserDashboard = () => {
  const { account, contract, isOwner, disconnectWallet } = useWeb3();
  const navigate = useNavigate();
  
  const [creditScore, setCreditScore] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [validatedCount, setValidatedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  
  // S3 Bucket URL - Update this with your S3 bucket URL
  // You can also use environment variable: process.env.REACT_APP_S3_BUCKET_URL
  const bucketUrl = process.env.REACT_APP_S3_BUCKET_URL || "https://capston-project-0012.s3.amazonaws.com";

  // Simplified form state - only document type and file
  const [formData, setFormData] = useState({
    docType: '0',
    documentFile: null
  });

  const loadUserData = async () => {
    if (!contract || !account) {
      console.log('Missing contract or account:', { contract: !!contract, account });
      return;
    }
    
    setLoading(true);
    try {
      console.log('Loading user data for account:', account);
      console.log('Contract address:', contract.target);
      
      // Check if contract is properly initialized
      if (!contract.target) {
        throw new Error('Contract is not properly initialized. Please reconnect your wallet.');
      }
      
      // Fetch user credit data
      let userCredit;
      try {
        userCredit = await contract.getUserCredit(account);
        console.log('User credit data:', userCredit);
      } catch (creditError) {
        console.error('Error fetching user credit:', creditError);
        // If user doesn't exist, set default values
        if (creditError.message && creditError.message.includes('User not found')) {
          setCreditScore(0);
          setValidatedCount(0);
          setDocuments([]);
          return;
        }
        throw creditError;
      }
      
      // Always set credit data, even if user doesn't exist yet
      // In ethers v6, BigNumber values are BigInt, so use Number() instead of toNumber()
      // Handle both array and object return formats
      const creditScore = Array.isArray(userCredit) ? Number(userCredit[0]) : Number(userCredit.creditScore);
      const validatedDocs = Array.isArray(userCredit) ? Number(userCredit[1]) : Number(userCredit.validatedDocs);
      setCreditScore(creditScore);
      setValidatedCount(validatedDocs);
      setError(null); // Clear any previous errors

      // Fetch user documents
      let userDocs;
      try {
        userDocs = await contract.getUserDocuments(account);
        console.log('User documents:', userDocs);
      } catch (docsError) {
        console.error('Error fetching user documents:', docsError);
        // If error fetching documents, set empty array
        setDocuments([]);
        return;
      }
      
      // Check if user has any documents
      if (!userDocs || !userDocs[0] || userDocs[0].length === 0) {
        console.log('No documents found for user');
        setDocuments([]);
        return;
      }
      
      // Get detailed document information
      try {
        const userDocDetails = await contract.getUserDocumentDetails(account);
        console.log('User document details:', userDocDetails);
        
        // Validate that arrays have the same length
        if (userDocDetails[0].length !== userDocs[0].length) {
          console.warn('Document details length mismatch, using basic info');
          throw new Error('Length mismatch');
        }
        
        // Map the basic and detailed information together
        // In ethers v6, BigNumber values are BigInt, so use Number() instead of toNumber()
        const formattedDocs = userDocs[0].map((docHash, index) => ({
          id: index,
          docHash: docHash,
          docType: Number(userDocs[1][index]), // docTypes array
          salary: Number(userDocDetails[0][index]), // salaries array
          employmentYears: Number(userDocDetails[1][index]), // employmentYears array
          repaymentHistoryScore: Number(userDocDetails[2][index]), // repaymentHistoryScores array
          currentBalance: Number(userDocDetails[3][index]), // currentBalances array
          lastTotalUtilityBills: Number(userDocDetails[4][index]), // lastTotalUtilityBills array
          documentAuthenticity: userDocDetails[5][index], // documentAuthenticities array
          isValidated: userDocs[2][index], // isValidatedArray array
          submissionTime: new Date(Number(userDocs[3][index]) * 1000), // submissionTimes array
          validationTime: Number(userDocDetails[6][index]) > 0 ? new Date(Number(userDocDetails[6][index]) * 1000) : null // validationTimes array
        }));
        
        console.log('Formatted documents:', formattedDocs);
        setDocuments(formattedDocs);
      } catch (detailError) {
        console.error('Error loading document details:', detailError);
        // Fallback: create basic document info without details
        // In ethers v6, BigNumber values are BigInt, so use Number() instead of toNumber()
        const basicDocs = userDocs[0].map((docHash, index) => ({
          id: index,
          docHash: docHash,
          docType: Number(userDocs[1][index]),
          salary: 0,
          employmentYears: 0,
          repaymentHistoryScore: 0,
          currentBalance: 0,
          lastTotalUtilityBills: 0,
          documentAuthenticity: false,
          isValidated: userDocs[2][index],
          submissionTime: new Date(Number(userDocs[3][index]) * 1000),
          validationTime: null
        }));
        console.log('Basic documents (fallback):', basicDocs);
        setDocuments(basicDocs);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Show user-friendly error message
      if (error.message) {
        console.error('Error details:', error.message);
        setError(`Failed to load data: ${error.message}`);
      } else {
        setError('Failed to load data from blockchain. Please check your connection and try again.');
      }
      // Don't clear existing data on error, just log it
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!account) {
      navigate('/');
    } else if (isOwner) {
      navigate('/validator');
    } else if (contract) {
      loadUserData();
    }
    // eslint-disable-next-line
  }, [account, isOwner, navigate, contract]);

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documentFile: e.target.files[0]
    });
    setUploadMessage(""); // Clear previous upload message
  };

  // Upload file to S3
  const uploadToS3 = async (file) => {
    if (!file) {
      throw new Error("No file selected");
    }

    // Create unique filename with user address and timestamp
    const timestamp = Date.now();
    const fileName = `${account?.slice(2, 10)}_${timestamp}_${file.name}`;
    const uploadUrl = `${bucketUrl}/${encodeURIComponent(fileName)}`;

    try {
      setUploadMessage("Uploading file to S3...");
      
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (res.ok) {
        const s3FileUrl = `${bucketUrl}/${fileName}`;
        setUploadMessage(`✅ File uploaded to S3 successfully!`);
        console.log('File uploaded to S3:', s3FileUrl);
        return s3FileUrl;
      } else {
        throw new Error(`S3 upload failed with status: ${res.status}`);
      }
    } catch (err) {
      console.error('S3 upload error:', err);
      throw new Error(`Failed to upload file: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !formData.documentFile || !account) {
      console.log('Missing contract, file, or account:', { 
        contract: !!contract, 
        file: !!formData.documentFile,
        account: !!account 
      });
      return;
    }

    setSubmitting(true);
    setUploadMessage("");
    setError(null);
    
    try {
      console.log('Submitting document:', formData);
      
      // Step 1: Upload file to S3 first
      let s3FileUrl;
      try {
        s3FileUrl = await uploadToS3(formData.documentFile);
        console.log('S3 file URL:', s3FileUrl);
      } catch (uploadError) {
        console.error('S3 upload failed:', uploadError);
        setError(`File upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }
      
      // Step 2: Generate hash for the file (using S3 URL + file name for uniqueness)
      const fileHash = ethers.keccak256(ethers.toUtf8Bytes(s3FileUrl + formData.documentFile.name + Date.now()));
      console.log('Generated file hash:', fileHash);
      
      // Generate unique values based on user's wallet address and timestamp
      // This ensures each user gets different credit scores
      // In a real app, these would be extracted from the document by validators
      const userSeed1 = parseInt(account.slice(2, 10), 16); // First part of wallet address
      const userSeed2 = parseInt(account.slice(10, 18), 16); // Second part of wallet address
      const userSeed3 = parseInt(account.slice(18, 26), 16); // Third part of wallet address
      const timestamp = Date.now();
      
      // Generate varied values within reasonable ranges using different seed combinations
      const salary = 30000 + ((userSeed1 + timestamp) % 70000); // $30k - $100k
      const employmentYears = 1 + ((userSeed2 + timestamp * 2) % 15); // 1 - 15 years
      const repaymentHistoryScore = 60 + ((userSeed3 + timestamp * 3) % 40); // 60 - 100
      const currentBalance = 5000 + ((userSeed1 + userSeed2 + timestamp) % 95000); // $5k - $100k
      const lastTotalUtilityBills = 100 + ((userSeed2 + userSeed3 + timestamp * 4) % 1900); // $100 - $2000
      const documentAuthenticity = true; // Always true for submitted documents

      console.log('Calling submitDocumentWithParams with:', {
        fileHash,
        docType: parseInt(formData.docType),
        salary,
        employmentYears,
        repaymentHistoryScore,
        currentBalance,
        lastTotalUtilityBills,
        documentAuthenticity
      });

      const tx = await contract.submitDocumentWithParams(
        fileHash,
        parseInt(formData.docType),
        salary,
        employmentYears,
        repaymentHistoryScore,
        currentBalance,
        lastTotalUtilityBills,
        documentAuthenticity
      );

      console.log('Transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt.blockNumber);
      
      // Wait a moment for the blockchain state to update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Reloading user data...');
      await loadUserData();
      
      // Reset form
      setFormData({
        docType: '0',
        documentFile: null
      });
      setUploadMessage("");
      
      alert('Document submitted successfully! File uploaded to S3 and submitted to blockchain. Validators will review and extract the details.');
    } catch (error) {
      console.error('Error submitting document:', error);
      setError(`Error submitting document: ${error.message}`);
      alert('Error submitting document: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getCreditScoreStatus = (score) => {
    if (score >= 800) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 700) return { label: 'Good', color: 'bg-blue-500' };
    if (score >= 600) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Building', color: 'bg-gray-500' };
  };

  const creditStatus = getCreditScoreStatus(creditScore);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Credit Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Wallet className="h-4 w-4" />
                <span className="font-mono">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(account);
                    alert('Address copied to clipboard!');
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  Copy
                </Button>
              </div>
              <Button onClick={loadUserData} variant="outline" size="sm" disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button onClick={disconnectWallet} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <Button
                  onClick={() => {
                    setError(null);
                    loadUserData();
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{creditScore}</div>
              <Badge className={`${creditStatus.color} text-white`}>
                {creditStatus.label}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validated Documents</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{validatedCount}</div>
              <p className="text-xs text-muted-foreground">Approved by validators</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">Submitted documents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Validation</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length - validatedCount}</div>
              <p className="text-xs text-muted-foreground">Under review</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submit">Submit Document</TabsTrigger>
            <TabsTrigger value="criteria">Document Criteria</TabsTrigger>
            <TabsTrigger value="documents">My Documents</TabsTrigger>
          </TabsList>

          {/* Submit Document Tab */}
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Submit New Document
                </CardTitle>
                <CardDescription>
                  Select a document type and upload your file. Validators will extract and verify the details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Helpful message about sharing address */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        How to get your documents validated:
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Submit your documents using the form below</li>
                          <li>Copy your wallet address (click "Copy" next to your address above)</li>
                          <li>Share your address with validators so they can review your documents</li>
                          <li>Validators will validate your documents and update your credit score</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="docType">Document Type</Label>
                    <Select value={formData.docType} onValueChange={(value) => setFormData({...formData, docType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Bank Statement (Required)</SelectItem>
                        <SelectItem value="1">Utility Bill (Required)</SelectItem>
                        <SelectItem value="2">Salary Slip (Optional)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentFile">Document File</Label>
                    <Input
                      id="documentFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, JPG, PNG. Max size: 10MB
                    </p>
                  </div>

                  <Button type="submit" disabled={submitting || !formData.documentFile} className="w-full">
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Document
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Criteria Tab */}
          <TabsContent value="criteria">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Document Requirements & Scoring
                </CardTitle>
                <CardDescription>
                  Understanding how each document contributes to your credit score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                        Bank Statement
                        <Badge className="ml-2">Required</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">Validators look for:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Current account balance</li>
                        <li>• Transaction history</li>
                        <li>• Account activity patterns</li>
                        <li>• Overdraft usage</li>
                      </ul>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium">Score Contribution:</p>
                        <p className="text-xs text-muted-foreground">Balance stability, transaction patterns</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Receipt className="h-5 w-5 mr-2 text-green-600" />
                        Utility Bill
                        <Badge className="ml-2">Required</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">Validators look for:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Bill payment history</li>
                        <li>• Consistent payment amounts</li>
                        <li>• No late payment fees</li>
                        <li>• Service continuity</li>
                      </ul>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium">Score Contribution:</p>
                        <p className="text-xs text-muted-foreground">Payment reliability, consistency</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
                        Salary Slip
                        <Badge variant="secondary" className="ml-2">Optional</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">Validators look for:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Monthly salary amount</li>
                        <li>• Employment duration</li>
                        <li>• Employer information</li>
                        <li>• Regular income pattern</li>
                      </ul>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium">Score Contribution:</p>
                        <p className="text-xs text-muted-foreground">Income stability, employment history</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Document History
                </CardTitle>
                <CardDescription>
                  View all your submitted documents and their validation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents submitted yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {doc.isValidated ? (
                                  <CheckCircle className="h-8 w-8 text-green-500" />
                                ) : (
                                  <Clock className="h-8 w-8 text-yellow-500" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{DOCUMENT_TYPE_NAMES[doc.docType]}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Submitted: {doc.submissionTime.toLocaleDateString()}
                                </p>
                                {doc.isValidated && doc.validationTime && (
                                  <p className="text-sm text-muted-foreground">
                                    Validated: {doc.validationTime.toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={doc.isValidated ? "default" : "secondary"}>
                                {doc.isValidated ? "Validated" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
