import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPasswordDialogComponent } from './master-password-dialog.component';

describe('MasterPasswordDialogComponent', () => {
  let component: MasterPasswordDialogComponent;
  let fixture: ComponentFixture<MasterPasswordDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterPasswordDialogComponent]
    });
    fixture = TestBed.createComponent(MasterPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
