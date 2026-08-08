import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env['R2_ENDPOINT'],
    credentials: {
        accessKeyId: process.env['R2_ACCESS_KEY_ID'] || '',
        secretAccessKey: process.env['R2_SECRET_ACCESS_KEY'] || '',
    },
});
/**
 * Generates a presigned URL for uploading a file directly from the frontend.
 * This is more efficient than uploading to our server first.
 */
export const getPresignedUploadUrl = async (fileName, contentType) => {
    const bucketName = process.env['R2_BUCKET_NAME'];
    if (!bucketName)
        throw new Error('R2_BUCKET_NAME is not configured');
    // Create a unique key for the file
    const fileExtension = fileName.split('.').pop();
    const key = `cars/${uuidv4()}.${fileExtension}`;
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
    });
    // URL expires in 1 hour
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    // The public URL to access the file after upload (using the endpoint)
    // Cloudflare R2 public URLs usually follow the pattern: https://<bucket>.<account-id>.r2.cloudflarestorage.com/<key>
    // or a custom domain if configured. 
    // For now, we'll return the key and the uploadUrl.
    // Note: R2 endpoints are usually like https://<account_id>.r2.cloudflarestorage.com
    // The public access URL might be different. Let's assume the user will configure a public domain or use the bucket URL.
    const publicUrl = `${process.env['R2_ENDPOINT']}/${bucketName}/${key}`;
    return { uploadUrl, publicUrl, key };
};
//# sourceMappingURL=storageService.js.map