import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeClientComponent } from './meme-client.component';

describe('MemeClientComponent', () => {
  let component: MemeClientComponent;
  let fixture: ComponentFixture<MemeClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
