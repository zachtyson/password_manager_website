import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPasswordComponent } from './export-password.component';

describe('ExportPasswordComponent', () => {
  let component: ExportPasswordComponent;
  let fixture: ComponentFixture<ExportPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportPasswordComponent]
    });
    fixture = TestBed.createComponent(ExportPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
