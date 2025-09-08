import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeCreationComponent } from './meme-creation.component';

describe('MemeCreationComponent', () => {
  let component: MemeCreationComponent;
  let fixture: ComponentFixture<MemeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
