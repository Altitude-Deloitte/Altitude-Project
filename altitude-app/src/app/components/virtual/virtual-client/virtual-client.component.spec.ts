import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualClientComponent } from './virtual-client.component';

describe('VirtualClientComponent', () => {
  let component: VirtualClientComponent;
  let fixture: ComponentFixture<VirtualClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
