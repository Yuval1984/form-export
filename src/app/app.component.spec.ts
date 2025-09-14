import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormComponent } from './form-export/components/form/form.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MockApiService } from './form-export/services/mock-api.service';
import { SignatureComponent } from './form-export/components/signature/signature.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { of } from 'rxjs';

// Mock services
class MockToastrService {
  success() { }
  error() { }
  warning() { }
  info() { }
}

class MockApiServiceClass {
  exportForm() { return of(true); }
  exportPdf() { return of(true); }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        FormComponent,
        NgxSpinnerModule,
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
        { provide: MockApiService, useClass: MockApiServiceClass },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should render FormComponent inside the app', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-form')).toBeTruthy();
  });

  it('should render ngx-spinner', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('ngx-spinner')).toBeTruthy();
  });
});
