import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesOnVtoComponent } from './shoes-on-vto.component';

describe('ShoesOnVtoComponent', () => {
  let component: ShoesOnVtoComponent;
  let fixture: ComponentFixture<ShoesOnVtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoesOnVtoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoesOnVtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
