import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EddieDetailComponent } from './eddie-detail.component';

describe('EddieDetailComponent', () => {
  let component: EddieDetailComponent;
  let fixture: ComponentFixture<EddieDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EddieDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EddieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
