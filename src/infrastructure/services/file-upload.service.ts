import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(FileUploadService.name);

  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('ACCESS_KEY'),
        secretAccessKey: this.config.getOrThrow<string>('SECRET_KEY'),
      },
    });
    this.bucketName = this.config.getOrThrow<string>('AWS_S3_BUCKET');
  }

  /**
   * Generate a presigned S3 URL for direct upload from the frontend.
   * Returns only the upload URL and the object key.
   */
  async generatePresignedUrl(
    mimeType: string,
    originalName: string,
    folder: string = 'uploads',
  ): Promise<{ uploadUrl: string; key: string }> {
    const key = `${folder}/${uuidv4()}-${originalName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour
      return { uploadUrl, key };
    } catch (error) {
      this.logger.error('Error generating presigned URL', error);
      throw error;
    }
  }

  /**
   * Construct a public CloudFront URL from an S3 key.
   * If the input is already a full URL, returns it as-is (backward compatibility).
   * @param key S3 object key or full URL
   * @returns Full CloudFront URL
   */
  getPublicUrl(key: string): string {
    // Backward compatibility: if already a full URL, return as-is
    if (key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }

    const cloudFrontDomain = this.config.get<string>('AWS_CLOUDFRONT_DOMAIN');
    if (!cloudFrontDomain) {
      this.logger.warn('AWS_CLOUDFRONT_DOMAIN not configured, returning key as-is');
      return key;
    }

    return `https://${cloudFrontDomain}/${key}`;
  }
}
