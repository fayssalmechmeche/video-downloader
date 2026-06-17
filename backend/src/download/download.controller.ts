import { Controller, Post, Body, Res } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadDto } from './dto/download.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Post('video')
  async downloadVideo(@Body() dto: DownloadDto, @Res() res: Response) {
    const filepath = await this.downloadService.downloadVideo(dto);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

    const stream = createReadStream(filepath);
    stream.pipe(res);

    stream.on('end', () => {
      unlink(filepath).catch(console.error);
    });
  }
}
