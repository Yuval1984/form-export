import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IForm } from '../interfaces/form.interface';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormExportLabels } from '../utils/labels';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private readonly apiUrl = '/api';
  private formExportLabels = FormExportLabels;
  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  exportForm(form: IForm): Observable<any> {
    this.spinner.show();

    return this.http.post(`${this.apiUrl}/form-export`, form).pipe(
      tap((res) => {
        console.log('form-export Response:', res);
        this.toastr.success(this.formExportLabels.formLabels.invoiceExported);
      }),
      catchError((err) => {
        console.error(err);
        this.toastr.error(this.formExportLabels.errorLabels.invoiceExportedError);
        return throwError(() => err);
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }

  exportPdf(formData: FormData): Observable<any> {
    this.spinner.show();

    return this.http.post(`${this.apiUrl}/pdf-export`, formData).pipe(
      tap((res) => {
        console.log('pdf-export Response:', res);
      }),
      catchError((err) => {
        console.error(err);
        this.toastr.error(this.formExportLabels.errorLabels.pdfExportedError);
        return throwError(() => err);
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
