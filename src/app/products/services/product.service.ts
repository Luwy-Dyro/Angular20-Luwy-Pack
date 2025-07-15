import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductResponse } from '@products/interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseurl = environment.BASE_URL

interface Options{
    limit?: number;
    offset?: number;
    gender?: string
}

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductService {
    
   
    private http = inject(HttpClient)

    private productsCache = new Map<string, ProductResponse>()
    private productCache = new Map<string, Product>()

    getProducts(options: Options): Observable<ProductResponse>{
       
        const {limit = 9, offset = 0, gender =''} = options
        console.log(this.productsCache.entries());
        
        const key =  `${limit}-${offset}-${gender}` //9-0-''

        if(this.productsCache.has(key)){
            return of (this.productsCache.get(key)!)
        }
        return this.http.get<ProductResponse>(`${baseurl}/products`, {
            params:{
                limit,
                offset,
                gender
            }
        } )
            .pipe(
                tap( resp => console.log(resp)),
                tap( resp => this.productsCache.set(key, resp) )
            )                          
    }
    

    getProductsBySlug(Slug: string ): Observable<Product> {
        const key =  `${Slug}` 
        if(this.productCache.has(key)){
            return of (this.productCache.get(key)!)
        }
        return this.http.get<Product>(`${baseurl}/products/${Slug}`)
                .pipe(
                    tap( result => console.log(result)),
                    // delay(2000),
                    tap( resp => this.productCache.set(key, resp) )
                )
    }

    getProductsById(id: string ): Observable<Product> {

        if( id === 'new'){
            return of(emptyProduct)
        }
      
        if(this.productCache.has(id)){
            return of (this.productCache.get(id)!)
        }
        return this.http.get<Product>(`${baseurl}/products/${id}`)
                .pipe(
                    tap( result => console.log(result)),
                    // delay(2000),
                    tap( resp => this.productCache.set(id, resp) )
                )
     }





     updateProduct(id: string, productLke: Partial<Product>, imageFileList?: FileList): Observable<Product>{
        
        const currentImages = productLke.images ?? []

        return this.uploadImages(imageFileList)
                    .pipe(
                        map(imageNames => ({
                            ...productLke,
                            images: [...currentImages, ...imageNames]
                        })),
                        switchMap( (updateProducts) => 
                           this.http.patch<Product>(`${baseurl}/products/${id}`, updateProducts)
                        ),
                        tap((product) => this.updateProductCache(product) )
                    )
        
        // return this.http.patch<Product>(`${baseurl}/products/${id}`, productLke)
        //         .pipe(
        //             tap((product) => this.updateProductCache(product) )
        //         )
        
     }

    createProduct(productLike: Partial<Product>,  imageFileList?: FileList): Observable<Product>{

        return this.http.post<Product>(`${baseurl}/products/`, productLike)
                 .pipe(
                    tap((product) => this.updateProductCache(product) )
                )    
        
     }


     updateProductCache(product: Product){
        const productId = product.id

        this.productCache.set(productId, product)

        this.productsCache.forEach(productResponse => {
            productResponse.products = productResponse.products.map( (currentProduct) =>{
                return currentProduct.id === productId ? product : currentProduct

            } )

        })

        console.log("Cache actualizado");
        
     }


     uploadImages(images?: FileList): Observable<string[]>{

        if(!images) return of([])
        
        const uploadObservables = Array.from(images)
            .map(imageFile => this.uploadImage(imageFile))

        return forkJoin(uploadObservables)
                .pipe(tap (imagesNames => console.log("Aquii", imagesNames)
                 ))
     }

     uploadImage(imageFile: File): Observable<string>{
        
        const formData = new FormData()
        
        formData.append('file', imageFile)

        return this.http
            .post<{fileName: string}>(`${baseurl}/files/product`, formData)
            .pipe(map((resp) => resp.fileName ))
     }


}