import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreinosPage } from './treinos.page';

describe('TreinosPage', () => {
  let component: TreinosPage;
  let fixture: ComponentFixture<TreinosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TreinosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
