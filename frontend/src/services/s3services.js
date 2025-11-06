import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
// Uses Cloud9 IAM role credentials automatically if available
// Otherwise falls back to environment variables
const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
  // Credentials are optional - will use Cloud9 IAM role if available
  // Otherwise will use environment variables if provided
  ...(process.env.REACT_APP_AWS_ACCESS_KEY_ID && process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        },
      }
    : {}),
});

const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME || 'credit-chain-documents';

/**
 * Upload a document to S3
 * @param {File} file - The file to upload
 * @param {string} walletAddress - User's wallet address
 * @param {string} docHash - Document hash from blockchain
 * @param {number} docType - Document type (0=Bank Statement, 1=Utility Bill, 2=Salary Slip)
 * @returns {Promise<string>} S3 key of the uploaded file
 */
export const uploadDocumentToS3 = async (file, walletAddress, docHash, docType) => {
  try {
    // Create S3 key: users/{walletAddress}/{docHash}/{filename}
    const fileExtension = file.name.split('.').pop();
    const fileName = `${docHash}.${fileExtension}`;
    const s3Key = `users/${walletAddress}/${docHash}/${fileName}`;

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type,
      Metadata: {
        walletAddress: walletAddress,
        docHash: docHash,
        docType: docType.toString(),
        uploadedAt: new Date().toISOString(),
        originalFileName: file.name,
      },
    });

    await s3Client.send(command);

    console.log('Document uploaded to S3:', s3Key);
    return s3Key;
  } catch (error) {
    console.error('Error uploading document to S3:', error);
    throw new Error(`Failed to upload document: ${error.message}`);
  }
};

/**
 * Get a presigned URL to view/download a document from S3
 * @param {string} s3Key - S3 key of the document
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns {Promise<string>} Presigned URL
 */
export const getDocumentUrl = async (s3Key, expiresIn = 3600) => {
  try {
    if (!s3Key) {
      throw new Error('S3 key is required');
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Error getting document URL:', error);
    throw new Error(`Failed to get document URL: ${error.message}`);
  }
};

/**
 * Delete a document from S3
 * @param {string} s3Key - S3 key of the document to delete
 * @returns {Promise<void>}
 */
export const deleteDocumentFromS3 = async (s3Key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    await s3Client.send(command);
    console.log('Document deleted from S3:', s3Key);
  } catch (error) {
    console.error('Error deleting document from S3:', error);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
};

/**
 * Generate S3 key from wallet address and document hash
 * @param {string} walletAddress - User's wallet address
 * @param {string} docHash - Document hash
 * @param {string} fileExtension - File extension (pdf, jpg, png, etc.)
 * @returns {string} S3 key
 */
export const generateS3Key = (walletAddress, docHash, fileExtension) => {
  return `users/${walletAddress}/${docHash}/document.${fileExtension}`;
};

/**
 * Calculate file hash for verification
 * @param {File} file - The file to hash
 * @returns {Promise<string>} File hash
 */
export const calculateFileHash = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return '0x' + hashHex;
  } catch (error) {
    console.error('Error calculating file hash:', error);
    throw new Error(`Failed to calculate file hash: ${error.message}`);
  }
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateFile = (file) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size exceeds 10MB limit',
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only PDF, JPG, and PNG files are allowed',
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: 'Invalid file extension. Only .pdf, .jpg, .jpeg, and .png files are allowed',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

