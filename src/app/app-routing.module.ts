import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeforeLoadGuard } from './core/security/guards/before-load.guard';

const routes: Routes = [
  {
    path: 'livro-do-professor',
    canActivate: [BeforeLoadGuard],
    loadChildren: () =>
      import('./shell/shell.module').then((m) => m.ShellModule)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'legacy',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
