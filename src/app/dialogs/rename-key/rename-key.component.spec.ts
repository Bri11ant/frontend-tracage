import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameKeyComponent } from './rename-key.component';

describe('RenameKeyComponent', () => {
  let component: RenameKeyComponent;
  let fixture: ComponentFixture<RenameKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenameKeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
