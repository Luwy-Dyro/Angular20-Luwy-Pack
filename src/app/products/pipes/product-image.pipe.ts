import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const baseURL = environment.BASE_URL

@Pipe({
    name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
    transform(value: null | string | string[]): string {

        if(value === null){
            return './assets/images/no-image.jpg'
        }

        if( typeof value === 'string' && value.startsWith('blob:') ) {
            
            return value
        }


        if( typeof value === 'string' ) {
            return `${baseURL}/files/product/${value}`
        }


        const image = value.at(0);

        if( !image){
            return './assets/images/no-image.jpg'
        }

        return  `${baseURL}/files/product/${image}`

        //array > 1 = primer elemento

        // string = string


        // placeholder image: ./addets/images/no-image.jpg
        


    }
}