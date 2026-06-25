import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DownloadDto } from './dto/download.dto';
import { exec } from 'child_process';
import { promisify } from 'util';
import { randomUUID } from 'crypto';
import { readdirSync, statSync } from 'fs';
import { unlink } from 'fs/promises';

const execPromise = promisify(exec);
const ALLOWED_DOMAINS = ['tiktok.com', 'twitter.com', 'x.com', 'snapchat.com'];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

@Injectable()
export class DownloadService {
  async downloadVideo(dto: DownloadDto): Promise<string> {
    const urlDomain = new URL(dto.url).hostname;

    if (!ALLOWED_DOMAINS.some((domain) => urlDomain.endsWith(domain))) {
      throw new BadRequestException('URL invalide ou non supportée');
    }

    const uuid = randomUUID();
    const filename = `/tmp/${uuid}.%(ext)s`;

    try {
      const { stderr } = await execPromise(
        `yt-dlp -o "${filename}" "${dto.url}"`,
      );

      if (stderr && stderr.includes('ERROR')) {
        throw new InternalServerErrorException(stderr);
      }

      const files = readdirSync('/tmp');
      const createdFile = files.find((f) => f.startsWith(uuid));
      if (!createdFile) {
        throw new InternalServerErrorException('Fichier introuvable');
      }
      const fileSize = statSync(`/tmp/${createdFile}`).size;
      if (fileSize > MAX_SIZE) {
        await unlink(`/tmp/${createdFile}`);
        throw new BadRequestException(
          'La vidéo est trop volumineuse (max 100MB)',
        );
      }

      if (!createdFile) {
        throw new InternalServerErrorException('Fichier introuvable');
      }

      return `/tmp/${createdFile}`;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('No video could be found')) {
        throw new BadRequestException('Aucune vidéo trouvée dans ce post');
      }
      if (message.includes('Unsupported URL') || message.includes('ERROR')) {
        throw new BadRequestException('URL invalide ou non supportée');
      }
      throw new InternalServerErrorException('Erreur lors du téléchargement');
    }
  }
}
