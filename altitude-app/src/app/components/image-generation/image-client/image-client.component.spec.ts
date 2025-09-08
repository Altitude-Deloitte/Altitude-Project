import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageClientComponent } from './image-client.component';

describe('ImageClientComponent', () => {
  let component: ImageClientComponent;
  let fixture: ComponentFixture<ImageClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
