import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as stream from 'stream';

@Injectable()
export class GoogleService {
  oAuth2Client = new google.auth.OAuth2();
  drive = google.drive({ version: 'v3' });

  constructor() {
    const clientId =
      '797025285452-cfa9tcf8erdfql3jtilv30tepclnnn03.apps.googleusercontent.com';
    const clientSecret = 'xfBHYq-whMhnBN3jknv_763y';

    const redirectUri = 'https://developers.google.com/oauthplayground';
    const refreshToken =
      '1//04LJkOOh1bT35CgYIARAAGAQSNwF-L9Irag1n54HKJxkzqcbFol9tQ_oKlv7B_S2CVmr49c4LW0fT07xVbZBRkK6xX1vjtJV0zBQ';

    this.oAuth2Client = new google.auth.OAuth2({
      clientId,
      clientSecret,
      redirectUri,
    });

    this.oAuth2Client.setCredentials({ refresh_token: refreshToken });

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

      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
}
