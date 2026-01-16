import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { FileUploadService } from 'infrastructure/services/file-upload.service';
import { SignedUrlResponseDto } from 'presentation/dtos/common.dto';
import { UploadFileCommand } from '../upload-file.command';

@Injectable()
@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async execute(command: UploadFileCommand): Promise<SignedUrlResponseDto> {
    const { mimeType, originalName, folder } = command.input;
    const { uploadUrl, key } = await this.fileUploadService.generatePresignedUrl(
      mimeType,
      originalName,
      folder,
    );
    return { uploadUrl, key };
  }
}
