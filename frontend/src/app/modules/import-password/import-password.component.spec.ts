import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPasswordComponent } from './import-password.component';

describe('ImportPasswordComponent', () => {
  let component: ImportPasswordComponent;
  let fixture: ComponentFixture<ImportPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportPasswordComponent]
    });
    fixture = TestBed.createComponent(ImportPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
