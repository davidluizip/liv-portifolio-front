import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { catchError, finalize, map, Observable, of, tap, iif } from 'rxjs';
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
      this.sessionService.get<string>(PortfolioStorage.liv_access_token) ||
      route.queryParamMap.get('token');

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

    return this.validateToken(token);
  }

  private validateSessionToken(headers: HttpHeaders) {
    return this.apiLivGatewayService.get<Omit<LivUserModel, 'token'>>(
      '/usuario',
      {
        headers
      }
    );
  }

  private validateUniqToken(headers: HttpHeaders) {
    return this.apiLivGatewayService
      .get<LivUserModel>('/usuario/getUserToken', {
        headers
      })
      .pipe(
        tap((data) => {
          if (data) {
            this.sessionService.save<string>(
              PortfolioStorage.liv_access_token,
              data.token
            );
          }
        })
      );
  }

  private validateToken(token: string): Observable<true | UrlTree> {
    const existsAccessToken = this.sessionService.exists(
      PortfolioStorage.liv_access_token
    );

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return iif(
      () => existsAccessToken,
      this.validateSessionToken(headers),
      this.validateUniqToken(headers)
    ).pipe(
      catchError(() => of(null)),
      finalize(() => this.loadingOverlayService.remove()),
      map((data) => {
        if (!!data) {
          return true;
        }

        if (existsAccessToken) {
          this.sessionService.delete(PortfolioStorage.liv_access_token);
        }

        return this.router.createUrlTree(['forbidden']);
      })
    );
  }
}
