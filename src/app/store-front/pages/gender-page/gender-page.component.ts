import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductService } from '@products/services/product.service';
import { PaginationComponent } from '@share/components/pagination/pagination.component';
import { PaginationService } from '@share/components/pagination/pagination.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [UpperCasePipe, ProductCardComponent,PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent { 

  activateRoute = inject(ActivatedRoute)
  productsService = inject(ProductService)

  paginationService = inject(PaginationService)
  
  routeGender = toSignal(

    this.activateRoute.params.pipe(
      map(({gender}) => gender )
    )

  )

  productsResourse = rxResource({

    params: () => {
      const gender = this.routeGender();
      if (!gender) { 
        return null; 
      }
      return {gender: gender, page: this.paginationService.currentPage() - 1} 
    },
    stream: ({params}) => {
      return this.productsService.getProducts({
        gender: params?.gender,
        // offset: params?.page * 9,
      })
    },

  })

}
