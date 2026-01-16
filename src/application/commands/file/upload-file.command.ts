import { CreateSignedUrlDto } from "presentation/dtos/common.dto";


export class UploadFileCommand {
  constructor(public readonly input: CreateSignedUrlDto) {}
}
