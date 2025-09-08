import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedClientComponent } from './combined-client.component';

describe('CombinedClientComponent', () => {
  let component: CombinedClientComponent;
  let fixture: ComponentFixture<CombinedClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombinedClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
