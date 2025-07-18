import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent { 

  pages = input(0)
  currenPage = input<number> (1)

  // activePage = signal(this.currenPage())
  activePage = linkedSignal(this.currenPage)


  getPagesList = computed( () => {
    return Array.from({ length: this.pages()}, (_, i) => i + 1 )

  })

}
