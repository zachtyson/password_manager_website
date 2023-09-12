import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCredentialComponent } from './createcredential.component';

describe('CreateCredentialComponent', () => {
  let component: CreateCredentialComponent;
  let fixture: ComponentFixture<CreateCredentialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCredentialComponent]
    });
    fixture = TestBed.createComponent(CreateCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
