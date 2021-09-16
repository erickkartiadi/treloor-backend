import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export class JwtConfig {
  static getJwtConfig(configService: ConfigService): JwtModuleOptions {
    return {
      secret: configService.get('JWT_SECRET_KEY'),
      signOptions: {
        expiresIn: parseInt(configService.get('JWT_EXPIRES')),
      },
    };
  }
}

export const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> =>
    JwtConfig.getJwtConfig(configService),
  inject: [ConfigService],
};
