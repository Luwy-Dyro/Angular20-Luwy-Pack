import { Component, inject, signal, Pipe } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product.service';
import { map, of, switchMap } from 'rxjs';
import { Product, ProductResponse } from '../../../products/interfaces/product.interface';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';

@Component({
  selector: 'app-producto-page',
  imports: [ProductCarouselComponent],
  templateUrl: './producto-page.component.html',
})
export class ProductoPageComponent {

  activedRoute = inject(ActivatedRoute)
  productsService = inject(ProductService)


  // PAra modo estatico en la URL  
    // productSlug: string = this.activeRoute.snapshot.params['Slug']

    // routeSlug = toSignal(
    //   this.activedRoute.params.pipe(
    //     map(params => params['idSlug'])
    //   ),
    //   {initialValue: ''}
    // )

    // productsResource = rxResource<{slug: string}, ProductResponse> ({
    //   params: () => ({ slug: this.routeSlug() }),
      
    //   stream: ({ params }) => this.productsService.getProductsBySlug(params.slug),
        
    //     defaultValue: { products:[]}
      
    // })
  
  //Modo reactivo
 
  productSlug = toSignal(
    this.activedRoute.params.pipe(
      map(params => params['idSlug'])
    )
  );

  productsResource = rxResource({ 
    params: () => {
      const slug = this.productSlug()
      return slug ? {slug : slug} : null
    },
    stream: ({params}) => {
      return this.productsService.getProductsBySlug(params?.slug);
    }
    
    // stream: () => { 
    //   const currentSlug = this.productSlug();

    //   if (currentSlug) {
    //     return this.productsService.getProductsBySlug(currentSlug);
    //   }
    //   return of(undefined); 
    // },
  
  });

 }
