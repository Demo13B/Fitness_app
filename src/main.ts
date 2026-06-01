import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const swagger_config = new DocumentBuilder().setTitle('Fitness API').build();
  const doc = SwaggerModule.createDocument(app, swagger_config);
  SwaggerModule.setup('swagger', app, doc, {
    swaggerOptions: {
      withCredentials: true
    }
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('APP_PORT', 3000);
  await app.listen(port);
}
bootstrap();
