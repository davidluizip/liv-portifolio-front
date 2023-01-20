import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import localeBr from '@angular/common/locales/pt';

import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './core/errors/GlobalErrorHandler';
import { HotToastModule } from '@ngneat/hot-toast';
import { ApiGatewayService } from './core/services/api/api-gateway.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { httpInterceptorProviders } from './core/interceptors';
import { registerLocaleData } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { ApiLivGatewayService } from './core/services/api/api-liv-gateway.service';

registerLocaleData(localeBr, 'pt-BR');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    HotToastModule.forRoot({
      reverseOrder: true
    }),
    AngularSvgIconModule.forRoot(),
    NgbModule
  ],
  providers: [
    httpInterceptorProviders,
    ApiGatewayService,
    ApiLivGatewayService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
