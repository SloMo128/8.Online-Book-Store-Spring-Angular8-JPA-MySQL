import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeedBack } from '../model/FeedBack';
import { Router } from '@angular/router';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('error is intercept')
        console.error(error);

        let feedback: FeedBack = {
          feedbackType: 'error',
          feedbackmsg: 'An error occurred.' // Messaggio di default
        };

        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            // Gestione degli errori di ErrorEvent (errori di rete lato client)
            feedback.feedbackmsg = `Client-side error: ${error.error.message}`;
          } else {
            // Gestione degli errori HTTP (errori di risposta dal server)
            switch (error.status) {
              case 0:
                feedback.feedbackmsg = 'Network error: Please check your internet connection.';
                break;
              case 400:
                feedback.feedbackmsg = 'Bad Request.';
                break;
              case 401:
                this.router.navigateByUrl("/login");
                feedback.feedbackmsg = 'Unauthorized.';
                break;
              case 403:
                this.router.navigateByUrl("/login");
                feedback.feedbackmsg = 'Forbidden.';
                break;
              case 404:
                feedback.feedbackmsg = 'Not found.';
                break;
              case 405:
                feedback.feedbackmsg = 'Method Not Allowed.';
                break;
              case 408:
                feedback.feedbackmsg = 'Request Timeout.';
                break;
              case 500:
                feedback.feedbackmsg = 'Internal server error.';
                break;
              case 503:
                feedback.feedbackmsg = 'Service Unavailable.';
                break;
              default:
                feedback.feedbackmsg = `HTTP Error: ${error.status}`;
                break;
            }
          }
        } else {
          // Gestione di altri tipi di errori
          feedback.feedbackmsg = error || 'An unexpected error occurred.';
        }

        console.error('Errore gestito:', feedback.feedbackmsg);
        return throwError(feedback);
      })
    );
  }
}