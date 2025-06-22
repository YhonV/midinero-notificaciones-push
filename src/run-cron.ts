// src/run-cron.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TasksService } from './tasks.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tasksService = app.get(TasksService);

  console.log('Iniciando la ejecución manual del cron job...');
  await tasksService.handleCron();
  console.log('La ejecución del cron job ha finalizado.');

  await app.close();
  process.exit(0);
}

bootstrap();