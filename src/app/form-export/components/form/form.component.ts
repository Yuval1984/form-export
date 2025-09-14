import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { SignatureComponent } from '../signature/signature.component';
import { FormExportLabels } from '../../utils/labels';
import { ToastrService } from 'ngx-toastr';
import { MockApiService } from '../../services/mock-api.service';
import { fullNameValidator } from '../../validators/fullName.validator';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-form',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SignatureComponent,
    MatCheckboxModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  title = 'form-export';
  userForm: FormGroup;
  @ViewChild('formToExport') formToExport!: ElementRef<HTMLFormElement>;
  isSignatureEmpty = true;
  isSubmitted = false;
  formExportLabels = FormExportLabels;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private mockApiService: MockApiService) {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, fullNameValidator()]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
      invoiceNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      invoiceDate: ['', Validators.required],
      signature: ['', Validators.required],
      shouldDownloadPdf: [{ value: true, disabled: true }],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (!this.isSubmitted) {
        this.isSubmitted = true;

        Promise.resolve().then(() => {
          this.exportPDF();
        });
      }
      else {
        this.toastr.warning(this.formExportLabels.formLabels.invoiceWasAlreadyExported);
      }
    }
  }

  isFormValid() {
    const isValid = this.userForm.valid && !this.isSignatureEmpty;
    if (!isValid) {
      this.isSubmitted = false;
      this.userForm.get('shouldDownloadPdf')?.disable();
    }
    else {
      this.userForm.get('shouldDownloadPdf')?.enable();
    }
    return isValid;
  }

  setSignature(signature: string) {
    this.isSignatureEmpty = signature === '';
    this.userForm.get('signature')?.setValue(signature);
    this.userForm.get('signature')?.updateValueAndValidity();
  }

  clearField(controlName: string) {
    const control = this.userForm.get(controlName);
    if (!control) return;

    control.setValue('', { emitEvent: false });
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity({ onlySelf: true });
  }

  exportPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const datePipe = new DatePipe('en-GB');

    // Title
    pdf.setFontSize(18);
    pdf.text('Invoice', 105, 15, { align: 'center' });

    pdf.setFontSize(12);
    const invoiceDate = this.userForm.get('invoiceDate')?.value;
    const formattedDate = datePipe.transform(invoiceDate, 'dd/MM/yyyy');
    pdf.text(`Date: ${formattedDate}`, 160, 25);
    pdf.text(`Invoice #: ${this.userForm.get('invoiceNumber')?.value}`, 20, 25);

    // Customer Info
    pdf.setFontSize(14);
    const x = 20;
    const y = 40;
    const text = 'Bill To:';
    pdf.text(text, x, y);

    const textWidth = pdf.getTextWidth(text);

    // Draw a line under the text
    pdf.setLineWidth(0.5);
    pdf.line(x, y + 1, x + textWidth, y + 1);
    pdf.setFontSize(12);

    // Invoice Details
    const labelX = 20;      // x position of where to start the labels
    const valueX = 50;      // x position of where to start the values
    let startY = 48;        // initial y position
    const lineHeight = 8;   // space between lines

    const fields = [
      { label: 'Full Name', value: this.userForm.get('fullName')?.value },
      { label: 'Email', value: this.userForm.get('email')?.value },
      { label: 'Phone', value: this.userForm.get('phone')?.value },
      { label: 'Amount', value: this.userForm.get('amount')?.value },
    ];

    fields.forEach((field, index) => {
      const y = startY + index * lineHeight;
      pdf.text(`${field.label}:`, labelX, y);
      pdf.text(`${field.value}`, valueX, y);
    });

    // Signature
    const imgData = this.userForm.get('signature')?.value;
    pdf.text('Signature:', 20, 140);
    pdf.addImage(imgData, 'PNG', 20, 145, 60, 30);

    // QR Code
    pdf.text('Invoice #:', 160, 243);
    QRCode.toDataURL(this.userForm.get('invoiceNumber')?.value).then((url) => {
      pdf.addImage(url, 'PNG', 155, 245, 40, 40);
      // Footer
      pdf.setFontSize(10);
      pdf.text(this.formExportLabels.formLabels.thankYou, 105, 280, { align: 'center' });

      const formBody = this.userForm.value;
      this.mockApiService.exportForm(formBody).subscribe({
        next: () => {
          if (this.userForm.get('shouldDownloadPdf')?.value) {
            pdf.save(`invoice_${this.userForm.get('invoiceNumber')?.value}.pdf`);
          }
          const pdfBlob: Blob = pdf.output('blob');
          const formData = new FormData();
          formData.append('fullName', this.userForm.get('fullName')?.value);
          formData.append('invoiceNumber', this.userForm.get('invoiceNumber')?.value);
          formData.append('pdf', pdfBlob, `invoice_${this.userForm.get('invoiceNumber')?.value}.pdf`);

          this.mockApiService.exportPdf(formData).subscribe({
            next: () => {
              this.toastr.success(this.formExportLabels.successLabels.pdfExported);
            }
          });
        }
      });
    });
  }
}
