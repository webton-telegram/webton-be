import { Injectable } from '@nestjs/common';
import { TelegramLoginData } from './dto/telegram.dto';
import { ConfigService } from '@app/common/config/config.service';
import { createHash, createHmac } from 'crypto';
import dayjs from 'dayjs';
import { TelegramUser } from '../auth/dto/auth.dto';

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
      .filter((e) => data[e as keyof typeof data])
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

  verifyInitData(
    telegramInitData: string,
    botToken?: string,
  ): [boolean, TelegramUser] {
    const urlParams: URLSearchParams = new URLSearchParams(telegramInitData);

    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();

    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
      dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const token =
      !ConfigService.isProduction() && botToken
        ? botToken
        : ConfigService.getConfig().TELEGRAM_BOT_TOKEN;

    const secret = createHmac('sha256', 'WebAppData').update(token);
    const calculatedHash = createHmac('sha256', secret.digest())
      .update(dataCheckString)
      .digest('hex');

    const isVerified = calculatedHash === hash;

    let telegramUser;
    if (isVerified) {
      telegramUser =
        typeof urlParams.get('user') === 'string'
          ? JSON.parse(urlParams.get('user')!)
          : urlParams.get('user');
    }

    return [isVerified, telegramUser];
  }
}
