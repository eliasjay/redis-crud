import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://127.0.0.1:5000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  addProduct(product) {
    return this.http.post(`${baseUrl}/carts`, product)
  }

  deleteProduct(id) {
    return this.http.delete(`${baseUrl}/carts/${id}`);
  }

  listProducts() {
    return this.http.get(`${baseUrl}/carts`);
  }

  updateProduct(id, name) {
    return this.http.patch(`${baseUrl}/carts/${id}`, { name });
  }
}
