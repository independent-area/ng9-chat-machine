import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add custom logic here to intercept and modify the request
    // For example, you can add headers or handle authentication.

    // Clone the request to avoid mutating the original request
    const token = localStorage.getItem('token');
    if(token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }

    // Pass the modified request to the next handler
    return next.handle(request);
  }
}
