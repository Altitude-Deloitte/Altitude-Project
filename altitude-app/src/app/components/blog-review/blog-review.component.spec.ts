import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogReviewComponent } from './blog-review.component';

describe('BlogReviewComponent', () => {
  let component: BlogReviewComponent;
  let fixture: ComponentFixture<BlogReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
