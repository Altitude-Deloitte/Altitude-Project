import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailReviewComponent } from './email-review.component';

describe('EmailReviewComponent', () => {
  let component: EmailReviewComponent;
  let fixture: ComponentFixture<EmailReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
