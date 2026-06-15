import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DownloadDto } from './dto/download.dto';
import { exec } from 'child_process';
import { promisify } from 'util';
import { randomUUID } from 'crypto';

const execPromise = promisify(exec);

@Injectable()
export class DownloadService {
  async downloadVideo(dto: DownloadDto): Promise<string> {
    const filename = `/tmp/${randomUUID()}.mp4`;

    try {
      const { stderr } = await execPromise(
        `yt-dlp -f best -o "${filename}" "${dto.url}"`,
      );
      if (stderr && stderr.includes('ERROR')) {
        throw new InternalServerErrorException(stderr);
      }
      return filename;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Unsupported URL') || message.includes('ERROR')) {
        throw new BadRequestException('URL invalide ou non supportée');
      }
      throw new InternalServerErrorException('Erreur lors du téléchargement');
    }
  }
}
