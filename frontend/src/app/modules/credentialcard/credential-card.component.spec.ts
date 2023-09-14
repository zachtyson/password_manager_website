import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialCardComponent } from './credential-card.component';

describe('CredentialCardComponent', () => {
  let component: CredentialCardComponent;
  let fixture: ComponentFixture<CredentialCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CredentialCardComponent]
    });
    fixture = TestBed.createComponent(CredentialCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
