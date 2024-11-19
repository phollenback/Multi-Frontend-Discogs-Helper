import { Component, OnInit } from '@angular/core';
import { Product } from '../models/products.model';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  confirmDelete(productId: number): void {
    const message = confirm('Are you sure you want to delete this product?');
    if (message) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.fetchProducts();
      });
    }
  }

  viewDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  editProduct(productId: number): void {
    this.router.navigate(['/edit-product', productId]);
  }
}
