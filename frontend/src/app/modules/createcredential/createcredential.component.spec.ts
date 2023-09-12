import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecredentialComponent } from './createcredential.component';

describe('CreatecredentialComponent', () => {
  let component: CreatecredentialComponent;
  let fixture: ComponentFixture<CreatecredentialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatecredentialComponent]
    });
    fixture = TestBed.createComponent(CreatecredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
