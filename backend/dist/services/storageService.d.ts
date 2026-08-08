/**
 * Generates a presigned URL for uploading a file directly from the frontend.
 * This is more efficient than uploading to our server first.
 */
export declare const getPresignedUploadUrl: (fileName: string, contentType: string) => Promise<{
    uploadUrl: string;
    publicUrl: string;
    key: string;
}>;
