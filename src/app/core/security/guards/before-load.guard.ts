import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { LoadingOverlayService } from 'src/app/shared/components/loading-overlay/loading-overlay.service';
import { environment } from 'src/environments/environment';
import { PortfolioStorage } from '../../enums/portfolio-storage.enum';
import { LivUserModel } from '../../models/liv-user.model';
import { ApiLivGatewayService } from '../../services/api/api-liv-gateway.service';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class BeforeLoadGuard implements CanActivate {
  readonly enableTokenVerification: boolean;

  constructor(
    private router: Router,
    private apiLivGatewayService: ApiLivGatewayService,
    private sessionService: SessionService,
    private loadingOverlayService: LoadingOverlayService,
    private toastService: ToastService
  ) {
    this.enableTokenVerification =
      environment.production || environment.stage === 'homologation';
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    _: RouterStateSnapshot
  ): UrlTree | Observable<true | UrlTree> {
    const token =
      route.queryParamMap.get('token') ||
      this.sessionService.get<string>(PortfolioStorage.liv_access_token);

    return this.enableTokenVerification ? this.can(token) : of(true);
  }

  private can(token: string): UrlTree | Observable<true | UrlTree> {
    if (!token) {
      this.toastService.error(
        'Sessão inválida! É necessário autenticar novamente!'
      );
      return this.router.createUrlTree(['forbidden']);
    }

    this.loadingOverlayService.open();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.apiLivGatewayService
      .get<LivUserModel>('/usuario/getUserToken', {
        headers
      })
      .pipe(
        catchError(() => of(null)),
        finalize(() => this.loadingOverlayService.remove()),
        map((data) => {
          if (data) {
            this.sessionService.save<string>(
              PortfolioStorage.liv_access_token,
              data.token
            );

            return true;
          }

          const existsAccessToken = this.sessionService.exists(
            PortfolioStorage.liv_access_token
          );

          if (existsAccessToken) {
            this.sessionService.delete(PortfolioStorage.liv_access_token);
          }

          return this.router.createUrlTree(['forbidden']);
        })
      );
  }
}
