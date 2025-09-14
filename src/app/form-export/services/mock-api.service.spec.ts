import { TestBed } from '@angular/core/testing';
import { MockApiService } from './mock-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

describe('MockApiService', () => {
    let service: MockApiService;
    let httpMock: HttpTestingController;
    let spinner: NgxSpinnerService;
    let toastr: ToastrService;

    beforeEach(() => {
        const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
        const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                MockApiService,
                { provide: NgxSpinnerService, useValue: spinnerSpy },
                { provide: ToastrService, useValue: toastrSpy }
            ]
        });

        service = TestBed.inject(MockApiService);
        httpMock = TestBed.inject(HttpTestingController);
        spinner = TestBed.inject(NgxSpinnerService);
        toastr = TestBed.inject(ToastrService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call spinner, toastr.success and return response on exportForm success', () => {
        const dummyForm = { fullName: 'John Doe' } as any;
        const dummyResponse = { success: true };

        service.exportForm(dummyForm).subscribe((res) => {
            expect(res).toEqual(dummyResponse);
        });

        const req = httpMock.expectOne('/api/form-export');
        expect(req.request.method).toBe('POST');
        expect(spinner.show).toHaveBeenCalled();

        req.flush(dummyResponse);

        expect(toastr.success).toHaveBeenCalledWith(service['formExportLabels'].formLabels.invoiceExported);
        expect(spinner.hide).toHaveBeenCalled();
    });

    it('should handle exportForm error and call toastr.error', () => {
        const dummyForm = { fullName: 'John Doe' } as any;
        const errorResponse = { status: 500, statusText: 'Server Error' };

        service.exportForm(dummyForm).subscribe({
            next: () => fail('should have failed with 500 error'),
            error: (err) => {
                expect(err.status).toBe(500);
            }
        });

        const req = httpMock.expectOne('/api/form-export');
        req.flush({}, errorResponse);

        expect(toastr.error).toHaveBeenCalledWith(service['formExportLabels'].errorLabels.invoiceExportedError);
        expect(spinner.hide).toHaveBeenCalled();
    });

    it('should call spinner and return response on exportPdf success', () => {
        const formData = new FormData();
        formData.append('fullName', 'John Doe');

        const dummyResponse = { success: true };

        service.exportPdf(formData).subscribe((res) => {
            expect(res).toEqual(dummyResponse);
        });

        const req = httpMock.expectOne('/api/pdf-export');
        expect(req.request.method).toBe('POST');
        expect(spinner.show).toHaveBeenCalled();

        req.flush(dummyResponse);

        expect(spinner.hide).toHaveBeenCalled();
    });

    it('should handle exportPdf error and call toastr.error', () => {
        const formData = new FormData();
        formData.append('fullName', 'John Doe');

        const errorResponse = { status: 500, statusText: 'Server Error' };

        service.exportPdf(formData).subscribe({
            next: () => fail('should have failed with 500 error'),
            error: (err) => {
                expect(err.status).toBe(500);
            }
        });

        const req = httpMock.expectOne('/api/pdf-export');
        req.flush({}, errorResponse);

        expect(toastr.error).toHaveBeenCalledWith(service['formExportLabels'].errorLabels.pdfExportedError);
        expect(spinner.hide).toHaveBeenCalled();
    });
});
