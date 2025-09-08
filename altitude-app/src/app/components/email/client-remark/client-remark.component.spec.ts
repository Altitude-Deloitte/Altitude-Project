import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRemarkComponent } from './client-remark.component';

describe('ClientRemarkComponent', () => {
  let component: ClientRemarkComponent;
  let fixture: ComponentFixture<ClientRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientRemarkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
