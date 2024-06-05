import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigContaPage } from './config-conta.page';

describe('ConfigContaPage', () => {
  let component: ConfigContaPage;
  let fixture: ComponentFixture<ConfigContaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigContaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
