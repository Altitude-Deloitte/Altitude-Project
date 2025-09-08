import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedFormComponent } from './combined-form.component';

describe('CombinedFormComponent', () => {
  let component: CombinedFormComponent;
  let fixture: ComponentFixture<CombinedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombinedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
