import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ToastrService } from 'ngx-toastr';
import { MockApiService } from '../../services/mock-api.service';
import { SignatureComponent } from '../signature/signature.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

class MockToastrService {
  success() { }
  error() { }
  warning() { }
  info() { }
}

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockApiService: jasmine.SpyObj<MockApiService>;

  beforeEach(async () => {
    const mockApiSpy = jasmine.createSpyObj('MockApiService', ['exportForm', 'exportPdf']);

    await TestBed.configureTestingModule({
      imports: [
        FormComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        NgFor,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        SignatureComponent
      ],
      providers: [
        { provide: ToastrService, useClass: MockToastrService },
        { provide: MockApiService, useValue: mockApiSpy },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(MockApiService) as jasmine.SpyObj<MockApiService>; // ✅ assign it here
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the form initialized with controls', () => {
    const controls = [
      'fullName', 'email', 'phone', 'invoiceNumber',
      'amount', 'invoiceDate', 'signature', 'shouldDownloadPdf'
    ];
    controls.forEach(control => {
      expect(component.userForm.get(control)).toBeTruthy();
    });
  });

  it('should mark the form as invalid if signature is empty', () => {
    component.setSignature('');
    expect(component.isFormValid()).toBeFalse();
  });

  it('should mark form as valid when all fields are filled correctly', () => {
    component.userForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      invoiceNumber: 'INV001',
      amount: 100,
      invoiceDate: new Date(),
      signature: 'data:image/png;base64,dummy',
      shouldDownloadPdf: true
    });

    component.setSignature('data:image/png;base64,dummy');
    expect(component.isFormValid()).toBeTrue();
    expect(component.userForm.valid).toBeTrue();
  });

  it('should enable PDF download if form is valid and signature is set', () => {
    component.userForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      invoiceNumber: 'INV123',
      amount: 100,
      invoiceDate: new Date(),
      signature: 'data:image/png;base64,dummy',
      shouldDownloadPdf: true
    });
    component.setSignature('data:image/png;base64,dummy');
    expect(component.isFormValid()).toBeTrue();
    expect(component.userForm.get('shouldDownloadPdf')?.enabled).toBeTrue();
  });
});