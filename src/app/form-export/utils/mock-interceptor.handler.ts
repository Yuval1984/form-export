import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { delay, Observable, of } from "rxjs";
import { IForm } from "../interfaces/form.interface";


export const mockPostInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const body: IForm = req.body;
  const randomDelay = Math.random() * 1000;

  if (req.method === 'POST' && req.url.endsWith('/api/form-export')) {
    return serverSideFormValidation(body, randomDelay);
  }

  if (req.method === 'POST' && req.url.endsWith('/api/pdf-export')) {
    const body: FormData = req.body;
    return serverSidePdfValidation(body, randomDelay);
  }

  return next(req);
};

function serverSideFormValidation(body: IForm, randomDelay: number) {

  //validation failures
  if (!body.fullName) {
    return of(new HttpResponse({ status: 400, body: { success: false, error: 'Full name is required' } }))
      .pipe(delay(randomDelay));
  }
  if (!body.email) {
    return of(new HttpResponse({ status: 400, body: { success: false, error: 'Email is required' } }))
      .pipe(delay(randomDelay));
  }
  if (!body.phone) {
    return of(new HttpResponse({ status: 400, body: { success: false, error: 'Phone is required' } }))
      .pipe(delay(randomDelay));
  }
  if (!body.invoiceNumber) {
    return of(new HttpResponse({ status: 400, body: { success: false, error: 'Invoice number is required' } }))
      .pipe(delay(randomDelay));
  }
  if (!body.amount) {
    return of(new HttpResponse({ status: 400, body: { success: false, error: 'Amount is required' } }))
      .pipe(delay(randomDelay));
  }
  if (!body.invoiceDate) {
    return of(new HttpResponse({ status: 400, body: { success: false, error: 'Invoice date is required' } }))
      .pipe(delay(randomDelay));
  }
  if (!body.signature) {
    return of(new HttpResponse({ status: 400, body: { success: false, error: 'Signature is required' } }))
      .pipe(delay(randomDelay));
  }

  const randomId = Math.floor(Math.random() * 1000);

  // Success
  const mockResponse = {
    id: randomId,
    success: true,
    timestamp: new Date().toISOString(),
    ...body
  };
  return of(new HttpResponse({ status: 200, body: mockResponse })).pipe(delay(randomDelay));
}

function serverSidePdfValidation(formData: FormData, randomDelay: number) {
  const randomId = Math.floor(Math.random() * 1000);

  // Map the fields from FormData manually
  const mockResponse = {
    id: randomId,
    success: true,
    timestamp: new Date().toISOString(),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    invoiceNumber: formData.get('invoiceNumber'),
    amount: formData.get('amount'),
    invoiceDate: formData.get('invoiceDate'),
    signature: formData.get('signature')
  };

  return of(new HttpResponse({ status: 200, body: mockResponse })).pipe(delay(randomDelay));
}

