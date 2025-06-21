import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksService } from './tasks.service'; 
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
