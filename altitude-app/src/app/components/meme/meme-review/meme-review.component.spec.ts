import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeReviewComponent } from './meme-review.component';

describe('MemeReviewComponent', () => {
  let component: MemeReviewComponent;
  let fixture: ComponentFixture<MemeReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
