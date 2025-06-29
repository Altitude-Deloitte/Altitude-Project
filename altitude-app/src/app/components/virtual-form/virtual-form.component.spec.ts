import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualFormComponent } from './virtual-form.component';

describe('VirtualFormComponent', () => {
  let component: VirtualFormComponent;
  let fixture: ComponentFixture<VirtualFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
