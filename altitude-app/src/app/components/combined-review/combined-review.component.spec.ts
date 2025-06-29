import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedReviewComponent } from './combined-review.component';

describe('CombinedReviewComponent', () => {
  let component: CombinedReviewComponent;
  let fixture: ComponentFixture<CombinedReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombinedReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
