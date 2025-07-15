import { Component, computed, effect, inject, signal } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '@products/services/product.service';
import { PaginationComponent } from '@share/components/pagination/pagination.component';
import { PaginationService } from '@share/components/pagination/pagination.service';



// import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent { 

  productService = inject(ProductService)
  paginationService = inject(PaginationService)

  // activatedRouted = inject(ActivatedRoute)

  // currentPage =  toSignal(

  //   this.activatedRouted.queryParamMap.pipe(
  //     map( params => (params.get('page') ? +params.get('page')! : 1) ),
  //     map(page => (isNaN(page) ? 1 : page))
  //   ),
  //   {
  //     initialValue: 1
  //   }

  // )

  products = rxResource({
    params: () => ({page: this.paginationService.currentPage() - 1}),
    stream: ({params}) => {
      return this.productService.getProducts({
        offset: params.page * 9
      }) 
    }
  })

  // Jalar products base sin Parametros
  //   products = rxResource({
  //   params: () => ({}),
  //   stream: ({params}) => {
  //     return this.productService.getProducts({}) 
  //   }
  // })


  //2da forma con signal
  // products = toSignal(
  //   this.productService.getProducts({}), 
  //   { initialValue: null }  // ProductResponse | null  
  // );

  // /** Señal para estado de carga */
  // isLoading = computed(() => this.products() === null);
  // error = signal<string | null>(null);



  
}



