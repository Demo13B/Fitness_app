import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swagger_config = new DocumentBuilder().setTitle('Fitness API').build();
  const doc = SwaggerModule.createDocument(app, swagger_config);
  SwaggerModule.setup('swagger', app, doc);

  const config = app.get(ConfigService);
  const port = config.get<number>('APP_PORT', 3000);
  await app.listen(port);
}
bootstrap();
