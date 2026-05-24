import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  Logger.log(`IAM service is running on http://localhost:${port}/${globalPrefix}`);
}

void bootstrap();
