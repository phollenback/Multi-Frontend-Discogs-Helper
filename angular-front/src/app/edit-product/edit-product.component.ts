import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: number;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: [''],
      artist: [''],
      releaseYear: [0],
      genre: [''],
      styles: ['']
    });
    this.productId = 0;
  }

  ngOnInit(): void {
    this.productId = parseInt(this.route.snapshot.paramMap.get('id')!);
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe(product => {
        this.productForm.patchValue(product);
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.updateProduct({discogsId: this.productId, ...this.productForm.value}).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}
