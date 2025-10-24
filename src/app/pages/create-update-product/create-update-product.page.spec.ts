import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpdateProductPage } from './create-update-product.page';

describe('CreateUpdateProductPage', () => {
  let component: CreateUpdateProductPage;
  let fixture: ComponentFixture<CreateUpdateProductPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
