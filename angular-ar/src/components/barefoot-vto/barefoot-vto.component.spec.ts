import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarefootVtoComponent } from './barefoot-vto.component';

describe('BarefootVtoComponent', () => {
  let component: BarefootVtoComponent;
  let fixture: ComponentFixture<BarefootVtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarefootVtoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarefootVtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
