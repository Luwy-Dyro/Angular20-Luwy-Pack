import { AfterViewInit, Component, computed, ElementRef, input, OnChanges, SimpleChanges, viewChild, ViewChild } from '@angular/core';


// import Swiper JS
import Swiper from 'swiper';

import { Navigation, Pagination } from 'swiper/modules';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
;



@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: ` 
      .swiper{
        width: 100%;
        height: 500px
      }
  `

})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {



  images = input.required<string[]>()
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper|undefined = undefined

  ngOnChanges(changes: SimpleChanges): void {
    
    if(changes ['images'].firstChange){
      return
    }

    if(!this.swiper) return

    this.swiper.destroy(true, true)

    const paginationSlider: HTMLDivElement = 
        this.swiperDiv().nativeElement?.querySelector('.swiper-pagination')

    paginationSlider.innerHTML = ''

    setTimeout( ()=>{
      this.swiperInit()
    }, 100)

        console.log(paginationSlider);
    
    this.swiperInit()
    // this.swiperInit()
  }
  
  ngAfterViewInit(): void {

    this.swiperInit()
  
  } 


  swiperInit(){
  const element = this.swiperDiv().nativeElement;
    if(!element) return

    this.swiper = new Swiper( element, {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    modules: [
      Navigation, Pagination
    ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

    console.log(element);
       

  }


}
