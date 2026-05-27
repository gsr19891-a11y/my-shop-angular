import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-footer',
  imports: [ReactiveFormsModule, DragDropModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  toggle: boolean = false;
  commentForm!: FormGroup;

  toggleComment() {
    this.toggle = !this.toggle;
    console.log(this.toggle);
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      age: [0],
      rating: [0],
      comment: [''],
    });
  }

  onSubmit(){
    if (this.commentForm.valid) {
      const formData = this.commentForm.value;
      this.productService.userComments(formData).subscribe({
        next: (response) => {
          console.log('Comment submitted successfully:', response);
        }
      })
      console.log(formData);
     
    }

  }
}
