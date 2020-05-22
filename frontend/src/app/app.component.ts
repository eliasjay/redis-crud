import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ApiService } from './services/api.service';


interface Product {
  id: number;
  name: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'redi-crud';

    form: FormGroup;
    nameToUpdate: string;
    products: Product[] = [];

    constructor(private apiService: ApiService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.form = this.formBuilder.group({ productName: null });
        this.listProducts();
    }

    addProduct() {
        const { productName } = this.form.value; 

        const product = {
            name: productName
        };

        this.apiService.addProduct(product)
            .subscribe(
                (res: Product[]) => {
                    this.products = res
                    console.log('[ADD] nome do product: ', this.products);
                    this.form.reset();
                },
                err => {
                    console.error('[ADD] deu erro: ', err);
                }
            );
    }

    listProducts() {
        this.apiService.listProducts()
            .subscribe(
                (res: Product[]) => {
                    this.products = res
                    console.log('[LISTA] products: ', this.products);
                },

                err => {
                    console.error('[LISTA] deu erro: ', err);
                }
            );
    }

    deleteProduct(id) {
        this.apiService.deleteProduct(id)
            .subscribe(
                (res: Product[]) => {
                    this.products = res
                    console.log('[DELETE] deleted product: ', this.products);
                },

                err => {
                    console.error('[DELETE] deu erro: ', err)
                }
            );
    }

    updateProduct(product: Product) {
        const { id, name } = product

        console.log('product', id, name, this.nameToUpdate)

        this.apiService.updateProduct(id, this.nameToUpdate)
            .subscribe(
                (res: Product[]) => {
                    this.products = res;

                    console.log('[UPDATE] updated product: ', this.products);
                },
                err => {
                    console.error('[UPDATE] deu erro: ', err);
                }
            );
    }

    changed(e) {
       const newProductName = e.target.value;
       
       this.nameToUpdate = newProductName
    }
}
