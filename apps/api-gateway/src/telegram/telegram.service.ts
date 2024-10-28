import { Injectable } from '@nestjs/common';
import { TelegramLoginData } from './dto/telegram.dto';
import { ConfigService } from '@app/common/config/config.service';
import { createHash, createHmac } from 'crypto';
import dayjs from 'dayjs';

@Injectable()
export class TelegramService {
  constructor() {}

  async verify(loginData: TelegramLoginData) {
    const { hash, ...data } = loginData;

    const authDate = dayjs.unix(data.auth_date);
    const now = dayjs();
    if (now.diff(authDate, 'day') >= 1) {
      return false;
    }

    const dataCheckString = Object.keys(data)
      .sort()
      .map((k) => `${k}=${data[k as keyof typeof data]}`)
      .join('\n');

    const secretKey = createHash('sha256')
      .update(ConfigService.getConfig().TELEGRAM_BOT_TOKEN)
      .digest();

    const hmac = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hmac === hash;
  }
}
