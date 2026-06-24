import { Controller, Post, Body, Res } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadDto } from './dto/download.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { extname } from 'path';

@UseGuards(ThrottlerGuard)
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Post('video')
  async downloadVideo(@Body() dto: DownloadDto, @Res() res: Response) {
    const filepath = await this.downloadService.downloadVideo(dto);
    const ext = extname(filepath);
    const mimeTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };

    res.setHeader('Content-Type', mimeTypes[ext] ?? 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="download${ext}"`,
    );

    const stream = createReadStream(filepath);
    stream.pipe(res);

    stream.on('end', () => {
      unlink(filepath).catch(console.error);
    });
  }
}
