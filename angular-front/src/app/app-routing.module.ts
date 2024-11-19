import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductComponent } from './view-product/view-product.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CreateProductComponent } from './create-product/create-product.component';

const routes: Routes = [
  { path: 'products', component: ViewProductComponent },
  { path: 'products/:id', component: DetailProductComponent }, 
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'add-product', component: CreateProductComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
