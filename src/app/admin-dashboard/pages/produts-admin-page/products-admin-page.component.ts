import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductTableComponent } from '@products/components/product-table/product-table.component';
import { ProductService } from '@products/services/product.service';
import { PaginationComponent } from '@share/components/pagination/pagination.component';
import { PaginationService } from '@share/components/pagination/pagination.service';

@Component({
  selector: 'app-produts-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {


  productService = inject(ProductService)
  paginationService = inject(PaginationService)

  productsPerPage = signal(10)

  products = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage()
    }),
     stream: ({params}) => {
      return this.productService.getProducts({
        offset: params.page * 9,
        limit: params.limit
      })
    }

  })





 }

