import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || config.get('port');

  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}/${globalPrefix}/`);
  });
}
bootstrap();
