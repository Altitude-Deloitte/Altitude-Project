import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialClientComponent } from './social-client.component';

describe('SocialClientComponent', () => {
  let component: SocialClientComponent;
  let fixture: ComponentFixture<SocialClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
