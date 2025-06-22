import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as admin from 'firebase-admin';

let serviceAccount;
// SI la variable de entorno existe...
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else {
  // SI NO, intenta cargar el archivo local (esta es la línea 8 que falla)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  serviceAccount = require('../mi-dinero-58798-firebase-adminsdk-fbsvc-56a8a8358b.json');
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor() {
    // Inicializamos Firebase Admin solo una vez
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  @Cron('10 20 * * *', { timeZone: 'America/Santiago' }) // Todos los días a las 19:00
  async handleCron() {
    this.logger.debug('Ejecutando recordatorio diario...');

    const tokensSnapshot = await admin.firestore().collection('fcm_tokens').get();
    if (tokensSnapshot.empty) {
      this.logger.log('No se encontraron tokens.');
      return;
    }

    const tokens = tokensSnapshot.docs.map((doc) => doc.id);
    this.logger.log(`Enviando notificación a ${tokens.length} tokens.`);

    const payload = {
      notification: {
        title: '🔔 ¡Es hora de tu recordatorio!',
        body: 'No olvides completar tu tarea diaria. ¡Tú puedes!',
      },
    };

    await admin.messaging().sendEachForMulticast({ tokens, ...payload });

    // Aquí podrías añadir la lógica para limpiar tokens inválidos si quieres.
  }
}