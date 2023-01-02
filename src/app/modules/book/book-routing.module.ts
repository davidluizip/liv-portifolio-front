import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookResolver } from 'src/app/core/resolvers/book.resolver';
import { BookComponent } from './book.component';

const routes: Routes = [
  {
    path: ':id',
    resolve: {
      book: BookResolver,
    },
    component: BookComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookRoutingModule {}
