import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBriefComponent } from './client-brief.component';

describe('ClientBriefComponent', () => {
  let component: ClientBriefComponent;
  let fixture: ComponentFixture<ClientBriefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientBriefComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
