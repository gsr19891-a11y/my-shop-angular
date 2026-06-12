import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductInfo } from '../product-info';
import { ProductService } from '../../../services/product-service';
import { AuthService } from '../../../services/auth-service';
import { ReviewsInterface } from '../../../interface/reviews-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-page.html',
  styleUrl: './reviews-page.scss'})
export class ReviewsPage {
  reviewsData!: ReviewsInterface | null;
  isLoggedIn: boolean = false;
  isModalOpen = false;
  selectedRate = 0;


  currentUserId: number | null = null;

  editingReviewId: number | null = null;

  averageRating: number = 0;
  stats: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  constructor(
    private productInfo: ProductInfo,
    private change: ChangeDetectorRef,
    private prodctService: ProductService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.reviewsData = this.productInfo.reviewsData;
    this.isLoggedIn = !!localStorage.getItem('userToken');

    if (this.reviewsData?.data?.items) {
      this.calculateStats(this.reviewsData.data.items);
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.currentUserId = parsed.id || parsed.data?.id;
    }

    if (!this.currentUserId && this.isLoggedIn) {
      this.authService.getUser().subscribe({
        next: (user: any) => {
          this.currentUserId = user?.id || user?.data?.id;
          console.log(this.currentUserId);
          this.change.detectChanges();
        },
      });
    }

    if (this.reviewsData?.data?.items) {
      this.calculateStats(this.reviewsData.data.items);
    }


  }

  openEditModal(review: any) {
    this.editingReviewId = review.id;
    this.selectedRate = review.rating;
    this.isModalOpen = true;
    this.change.detectChanges();
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;

    if (this.isModalOpen) {
      const myReview = this.reviewsData?.data?.items.find(
        (item) => item.user.id === this.currentUserId,
      );

      if (myReview) {
        this.editingReviewId = myReview.id;
        this.selectedRate = myReview.rating;
      } else {
        this.editingReviewId = null;
        this.selectedRate = 0;
      }
    } else {
      this.selectedRate = 0;
      this.editingReviewId = null;
    }
  }

submitReview() {
  if (this.selectedRate === 0) return;

  const productId = this.productInfo.productId?.data?.id;
  const productName = this.productInfo.productId?.data?.name || 'the product';
  const currentRating = this.selectedRate;

  if (!productId) return;


  this.authService.getUser().subscribe({
    next: (userRes: any) => {
      const userEmail = userRes.data.email;
      const userName = userRes.data.firstName;


      if (this.editingReviewId) {
        

        this.prodctService.updateReview(this.editingReviewId, currentRating).subscribe({
          next: () => {
      
            this.prodctService.sendReviewNotification(currentRating, productName, userEmail, userName).subscribe();
            
            this.toggleModal();
            this.refreshReviews(productId);
          },
          error: (err) => console.error('Update error:', err),
        });

      } else {
        

        this.prodctService.addReview(productId, currentRating).subscribe({
          next: () => {

            this.prodctService.sendReviewNotification(currentRating, productName, userEmail, userName).subscribe();

            this.toggleModal();
            this.refreshReviews(productId);
          },
          error: (err) => console.error('Submission error:', err),
        });
      }
    },
    error: (err) => console.error('Failed to get user data:', err)
  });
}
  deleteReview(reviewId: number) {
    const productId = this.productInfo.productId?.data?.id;
    if (!productId) return;

    if (confirm('Are you sure you want to delete your review?')) {
      this.prodctService.deleteReview(reviewId).subscribe({
        next: () => this.refreshReviews(productId),
        error: (err) => console.error('Delete error:', err),
      });
    }
  }

  private refreshReviews(id: number) {
    this.prodctService.reviews(id).subscribe((res) => {
      this.reviewsData = res;
      if (res.data?.items) {
        this.calculateStats(res.data.items);
      }
      this.change.detectChanges();
    });
  }

  private calculateStats(items: any[]): void {
    if (!items.length) {
      this.stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      this.averageRating = 0;
      return;
    }
    let totalScore = 0;
    this.stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    items.forEach((item) => {
      totalScore += item.rating;
      if (this.stats[item.rating] !== undefined) this.stats[item.rating]++;
    });
    this.averageRating = parseFloat((totalScore / items.length).toFixed(1));
  }

  setRate(rate: number) {
    this.selectedRate = rate;
  }
  getPercent(starCount: number): number {
    const total = this.reviewsData?.data?.totalCount || 1;
    return (starCount / total) * 100;
  }
  mathRound(value: number): number {
    return Math.round(value);
  }

  openReviewModal() {
    const myReview = this.reviewsData?.data?.items.find(
      (item) => item.user.id === this.currentUserId,
    );

    if (myReview) {
      this.editingReviewId = myReview.id;
      this.selectedRate = myReview.rating;
    } else {
      this.editingReviewId = null;
      this.selectedRate = 0;
    }

    this.isModalOpen = true;
    this.change.detectChanges();
  }

  deleteFromModal() {
    if (this.editingReviewId) {
      this.deleteReview(this.editingReviewId);
      this.toggleModal();
    }
  }
}
