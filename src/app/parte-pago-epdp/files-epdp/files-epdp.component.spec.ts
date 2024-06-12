import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesEpdpComponent } from './files-epdp.component';

describe('FilesEpdpComponent', () => {
  let component: FilesEpdpComponent;
  let fixture: ComponentFixture<FilesEpdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesEpdpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesEpdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
