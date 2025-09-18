import { CommonModule, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { signatureConfig } from './signature.config';
import { FormExportLabels } from '../../utils/labels';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature',
  imports: [CommonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,],
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.scss',
  standalone: true,
})
export class SignatureComponent implements AfterViewInit, OnDestroy {
  signatureControl: FormControl = new FormControl('', Validators.required)
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  @Output() signatureChange = new EventEmitter<string>();
  signaturePad!: SignaturePad;
  isSignatureEmpty = true;
  SignatureSvg: string = '';
  formExportLabels = FormExportLabels;

  ngAfterViewInit() {
    this.adjustCanvasForHighDPI();
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
      backgroundColor: signatureConfig.backgroundColor,
      penColor: signatureConfig.penColor
    });

    this.signaturePad.addEventListener("endStroke", this.endStrokeHandler);
  }

  ngOnDestroy() {
    this.signaturePad.removeEventListener("endStroke", this.endStrokeHandler);
  }

  // Adjusts canvas for high-DPI screens like smartphones

  adjustCanvasForHighDPI() {
    const canvas = this.signatureCanvas.nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(ratio, ratio);
  }

  endStrokeHandler = () => {
    this.isSignatureEmpty = this.signaturePad.isEmpty();

    if (!this.isSignatureEmpty) {
      const dataURL = this.signaturePad.toDataURL('image/png');
      this.signatureControl.markAsTouched();
      this.signatureControl.setValue(dataURL);
      this.signatureControl.updateValueAndValidity();
      this.signatureChange.emit(dataURL);
    } else {
      this.signatureControl.reset();
    }
  };

  clearSignature() {
    this.signaturePad.clear();
    this.signatureControl.setValue('');
    this.isSignatureEmpty = true;
    this.signatureChange.emit('');
  }

  isSignatureValid(): boolean {
    return !this.signatureControl.touched || this.signatureControl.valid;
  }

}
