import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor() {}

  @Get()
  @HttpCode(200)
  check(): string {
    return 'OK';
  }
}
