import { Injectable } from '@angular/core';
import { ApiGatewayService } from '../../services/api/api-gateway.service';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private apiGatewayService: ApiGatewayService) {}

  logError(message: string, stack?: string): void {
    // eslint-disable-next-line no-console
    console.info('LoggerService =>', { message, stack });
  }

  sendErrorToServer(message: string): void {
    // TO-DO
  }
}
