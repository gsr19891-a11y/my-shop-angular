import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductIdInterfaceFull } from '../../../interfaceById/product-id-interface-full';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { ProductInfo } from '../product-info';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-description-page',
  imports: [CommonModule],
  templateUrl: './description-page.html',
  styleUrl: './description-page.scss',
})
export class DescriptionPage {
  productId!: ProductIdInterfaceFull | null
  
  


  constructor(
    private productService: ProductService,
    private change: ChangeDetectorRef,
    private productInfo:ProductInfo
  ){}

  ngOnInit(): void {
    this.productId = this.productInfo.productId
    this.change.detectChanges();
    
  }


}
