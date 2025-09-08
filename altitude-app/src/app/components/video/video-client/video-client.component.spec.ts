import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoClientComponent } from './video-client.component';

describe('VideoClientComponent', () => {
  let component: VideoClientComponent;
  let fixture: ComponentFixture<VideoClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
