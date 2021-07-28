import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { google } from 'googleapis';
import * as stream from 'stream';
import { SharedFileDto } from './dto/share-file.dto';

@Injectable()
export class GoogleService {
  oAuth2Client = new google.auth.OAuth2();
  drive = google.drive({ version: 'v3' });

  constructor(private readonly configService: ConfigService) {
    this.oAuth2Client = new google.auth.OAuth2({
      clientId: configService.get('CLIENT_ID'),
      clientSecret: configService.get('CLIENT_SECRET'),
      redirectUri: configService.get('REDIRECT_URI'),
    });

    this.oAuth2Client.setCredentials({
      refresh_token: configService.get('REFRESH_TOKEN'),
    });

    this.drive = google.drive({
      version: 'v3',
      auth: this.oAuth2Client,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const fileBuffer = new stream.PassThrough();
    fileBuffer.end(file.buffer);

    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: 'application/pdf',
        },
        media: {
          mimeType: 'application/pdf',
          body: fileBuffer,
        },
      });

      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          type: 'anyone',
          role: 'reader',
        },
      });

      const sharedFile = await this.drive.files.get({
        fileId: response.data.id,
        fields: 'id, webViewLink',
      });

      return plainToClass(SharedFileDto, sharedFile.data);
    } catch (error) {
      console.log(error.message);
    }
  }
}
