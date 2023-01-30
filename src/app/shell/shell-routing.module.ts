import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookResolver } from './resolvers/book.resolver';
import { BookComponent } from './book/book.component';

const routes: Routes = [
  {
    path: ':id',
    resolve: {
      book: BookResolver
    },
    component: BookComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {}
