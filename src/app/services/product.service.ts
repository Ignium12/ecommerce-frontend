import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private categoryUrl = 'http://localhost:8080/api/product-category';
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getProduct(productId: number): Observable<Product> {
    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
    thePageSize: number,
    categoryId: number): Observable<GetResponseProducts> {

    // need to build URL base on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
      + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProductList(categoryId: number): Observable<Product[]> {

    // need to build URL base on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`

    return this.getProducts(searchUrl);

  }

  searchProducts(keyword: string): Observable<Product[]> {
    // need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate( thePage: number,
                          thePageSize: number,
                          theKeyword: string): Observable<GetResponseProducts> {

    // need to build URL base on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl);
 }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)

    );
  }
}



interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
