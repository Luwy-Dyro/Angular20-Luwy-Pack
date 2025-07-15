import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/product.service';
import { map } from 'rxjs';
import { ProductDetailsComponent } from './product-details/product-details.component';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent { 

  activateRoute = inject(ActivatedRoute) // para la navegacion y tomar la ruta activa
  router = inject(Router) //Para la redirección

  productService = inject(ProductService)

  productId = toSignal(
    this.activateRoute.params.pipe(
      map(params => params['id'])
    )
  )

  productResource = rxResource({
    params:() => ({id: this.productId()}),
    stream:({params}) => {
      return this.productService.getProductsById(params.id)
    } 
  })


  redirecEffect = effect( () => {

    if(this.productResource.error()){
      this.router.navigate(['/admin/products'])
    }

  }) 

}
