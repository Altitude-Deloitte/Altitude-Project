import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogClientComponent } from './blog-client.component';

describe('BlogClientComponent', () => {
  let component: BlogClientComponent;
  let fixture: ComponentFixture<BlogClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
