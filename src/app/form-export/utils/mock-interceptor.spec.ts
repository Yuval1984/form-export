import { mockPostInterceptor } from './mock-interceptor.handler';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { IMockBody } from '../interfaces/form.interface';

interface FormExportResponse {
    success: boolean;
    error?: string;
    id?: number;
    timestamp?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    invoiceNumber?: string;
    amount?: number;
    invoiceDate?: string | Date;
    signature?: string;
}

describe('mockPostInterceptor', () => {

    const next = jasmine.createSpy('next').and.callFake((req: any) => of(req));

    it('should return 400 if fullName is missing in form-export', (done) => {
        const req = new HttpRequest('POST', '/api/form-export', {
            email: 'test@test.com',
            phone: '1234567890',
            invoiceNumber: 'INV001',
            amount: 100,
            invoiceDate: new Date(),
            signature: 'data:image/png;base64,signature'
        });

        mockPostInterceptor(req, next).pipe(take(1)).subscribe((event) => {
            if (event instanceof HttpResponse) {
                const body = event.body as FormExportResponse;
                expect(event.status).toBe(400);
                expect(body.error).toBe('Full name is required');
                done();
            }
        });
    });

    it('should return 200 if all required fields are present in form-export', (done) => {
        const req = new HttpRequest('POST', '/api/form-export', {
            fullName: 'John Doe',
            email: 'test@test.com',
            phone: '1234567890',
            invoiceNumber: 'INV001',
            amount: 100,
            invoiceDate: new Date(),
            signature: 'data:image/png;base64,signature'
        });

        mockPostInterceptor(req, next).pipe(take(1)).subscribe((event) => {
            if (event instanceof HttpResponse) {
                const body = event.body as FormExportResponse;
                expect(event.status).toBe(200);
                expect(body.success).toBeTrue();
                expect(body.fullName).toBe('John Doe');
                done();
            }
        });
    });

    it('should return 200 for pdf-export POST', (done) => {
        const formData = new FormData();
        formData.append('fullName', 'John Doe');

        const req = new HttpRequest('POST', '/api/pdf-export', formData);

        mockPostInterceptor(req, next).pipe(take(1)).subscribe((event) => {
            if (event instanceof HttpResponse) {
                const body = event.body as any;
                expect(event.status).toBe(200);
                expect(body.fullName).toBe('John Doe');
                expect(body.success).toBeTrue();
                done();
            }
        });
    });

    it('should return 200 for pdf-export POST', (done) => {
        const formData = new FormData();
        formData.append('fullName', 'John Doe');

        const req = new HttpRequest('POST', '/api/pdf-export', formData);

        mockPostInterceptor(req, next).pipe(take(1)).subscribe((event) => {
            if (event instanceof HttpResponse) {
                const body = event.body as IMockBody;
                expect(event.status).toBe(200);
                expect(body.success).toBeTrue();
                expect(body.fullName).toBe('John Doe');
                done();
            }
        });
    });

});
