import { 
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse 
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, map, catchError, throwError } from "rxjs";
import { AppService } from "../app.service";
import { LoginService } from "../login/login.service";
import { IgnoreHttpEventService } from "../shared-services/ignore-http-event.service";

@Injectable()
export class Interceptor implements HttpInterceptor{
    constructor(private cookieService: CookieService,
        private appService:AppService,
        private loginService: LoginService,
        private ignoreHttpEventService: IgnoreHttpEventService){
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var ignoreEvent = this.ignoreHttpEventService.check(req.url, req.method);
        if(!ignoreEvent)
        this.appService.httpEvent.next(true)
        var token:string = this.cookieService.get('jwt');
        if(token && token.length){
            req = req.clone({
                setHeaders:{
                    Authorization: `Bearer ${token}`
                }
            })
        }
        return next.handle(req).pipe(map((ev)=>{
            if(ev instanceof HttpResponse && !ignoreEvent)
                this.appService.httpEvent.next(false);
            return ev;
        }), catchError((err: HttpErrorResponse) => {
            if(err && !ignoreEvent)
                this.appService.httpEvent.next(false);
            if(err?.status === 401)
                this.loginService.challenge();
            return throwError(() => err);
        }));
    }
    
}