import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Permitir CORS si es necesario
    app.useGlobalPipes(new ValidationPipe()); // Esto habilita la validación
    await app.listen(3001);
}
bootstrap();
