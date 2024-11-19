import { Component, OnInit } from '@angular/core';
import { Product } from '../models/products.model';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit{
  product: Product | undefined;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {  
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProduct(+productId).subscribe(product => {
        console.log(product);
        this.product = product;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
