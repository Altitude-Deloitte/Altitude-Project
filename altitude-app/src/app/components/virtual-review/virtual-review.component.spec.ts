import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualReviewComponent } from './virtual-review.component';

describe('VirtualReviewComponent', () => {
  let component: VirtualReviewComponent;
  let fixture: ComponentFixture<VirtualReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
