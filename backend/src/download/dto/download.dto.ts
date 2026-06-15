import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DownloadDto {
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  url!: string;
}
