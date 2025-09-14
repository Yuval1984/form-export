import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignatureComponent } from './signature.component';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import SignaturePad from 'signature_pad';

describe('SignatureComponent', () => {
  let component: SignatureComponent;
  let fixture: ComponentFixture<SignatureComponent>;
  class MockSignaturePad {
    isEmpty(): boolean { return false; }
    toDataURL(): string { return 'data:image/png;base64,dummy'; }
    clear(): void { }
    addEventListener(event: string, handler: any) { }
    removeEventListener(event: string, handler: any) { }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignatureComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        MatButtonModule,
        MatFormFieldModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignatureComponent);
    component = fixture.componentInstance;

    const canvas = document.createElement('canvas');
    Object.defineProperty(component, 'signatureCanvas', { value: { nativeElement: canvas } });
    component.signaturePad = new MockSignaturePad() as unknown as SignaturePad;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have signatureControl initialized as required', () => {
    expect(component.signatureControl).toBeTruthy();
    expect(component.signatureControl.valid).toBeFalse();
    expect(component.signatureControl.hasValidator(Validators.required)).toBeTrue();
  });

  it('should handle endStrokeHandler and emit signature', () => {
    spyOn(component.signaturePad, 'isEmpty').and.returnValue(false);

    spyOn(component.signaturePad, 'toDataURL').and.returnValue('data:image/png;base64,dummy');

    spyOn(component.signatureChange, 'emit');

    component.endStrokeHandler();

    expect(component.isSignatureEmpty).toBeFalse();
    expect(component.signatureControl.value).toBe('data:image/png;base64,dummy');
    expect(component.signatureChange.emit).toHaveBeenCalledWith('data:image/png;base64,dummy');
  });

  it('should clear signature when clearSignature is called', () => {
    spyOn(component.signatureChange, 'emit');
    component.clearSignature();
    expect(component.isSignatureEmpty).toBeTrue();
    expect(component.signatureControl.value).toBe('');
    expect(component.signatureChange.emit).toHaveBeenCalledWith('');
  });

  it('should validate signature correctly', () => {
    expect(component.isSignatureValid()).toBeTrue();

    component.signatureControl.markAsTouched();
    component.signatureControl.setValue('');
    expect(component.isSignatureValid()).toBeFalse();
  });
});
