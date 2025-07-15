import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';

import { Product } from '@products/interfaces/product.interface';
import { ProductService } from '@products/services/product.service';
import { FormErrorLabelComponent } from '@utils/form-error-label/form-error-label.component';
import { FormUtils } from '@utils/form.utils';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  router = inject(Router)
  product = input.required<Product>()
  productService = inject(ProductService)

  wasSave = signal(false)

  imageFileList: FileList|undefined = undefined
  temImages= signal<string[]>([])

  imagesToCarousel = computed( () => {
    const currentProductImages = [...this.product().images, ...this.temImages()]

    return currentProductImages
  })


  fb = inject(FormBuilder)

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/ )]],
  })



  sizes = ['XS','S','M','L','XL','XXL']

  ngOnInit(): void {
    // this.productForm.reset(this.product() as any)
    this.setFormValue(this.product())
  } 

  setFormValue( formLike: Partial<Product>){

    this.productForm.patchValue(formLike as any)
    this.productForm.patchValue( {tags: formLike.tags?.join(',')} )

  }

  onSizeClicked(size: string){

    const currenSizes = this.productForm.value.sizes ?? []

    if( currenSizes.includes(size)){
      currenSizes.splice(currenSizes.indexOf(size), 1)
    }else{
      currenSizes.push(size)
    }

    this.productForm.patchValue( {sizes: currenSizes} )
  }




  async onSubmit(){
    const isValid = this.productForm.valid  
    // console.log(this.productForm.value, {isValid});

    this.productForm.markAllAsTouched() // verifica si todo los campos son llenados o envia errors

    if(!isValid) return
        
    const formValue = this.productForm.value

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',')
      .map(tag => tag.trim()) ?? []
    }

    // console.log(productLike);
    if (this.product().id  === 'new'){

      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      )
      
      
      this.router.navigate(['/admin/products/', product.id])

      //  this.productService.createProduct(productLike).subscribe( product => {
      //   console.log("Producto creado");
      //   this.router.navigate(['/admin/products/', product.id])

      //   this.wasSave.set(true)
      //  })
    }else{

       await firstValueFrom(

        this.productService.updateProduct(this.product().id, productLike, this.imageFileList)
       )
      // this.productService.updateProduct(this.product().id, productLike)
      //   .subscribe(product => {
      //     console.log("Product Updated");
          
      //   }
      // )
    }

    this.wasSave.set(true);

    setTimeout( () =>{
      this.wasSave.set(false);
    },3000)

  }


  onFilesChange( event: Event){
    const fileList = (event.target as HTMLInputElement).files
    // console.log(fileList);
    this.imageFileList = fileList ?? undefined

    const imageURL = Array.from( fileList ?? [])
      .map( (file) => URL.createObjectURL(file)
    )
    
    console.log({imageURL});
    this.temImages.set(imageURL)
    
  }

}
