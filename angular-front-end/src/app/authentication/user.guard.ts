import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { HttpClientService } from '../service/http-client.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    admin: boolean = false;

    constructor(private authService: HttpClientService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        // Contains the information about a route associated with a component loaded in an outlet at a particular moment in time
        state: RouterStateSnapshot
        // Represents the state of the router at a moment in time.
    ): boolean | UrlTree {// UrlTree is a data structure that provides a lot of affordances in dealing with URLs
        let url: string = state.url;

        return this.checkLogin(url);
    }

    checkLogin(url: string): true | UrlTree {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        this.admin = user && user.type === 'ADM';

        if (this.admin) {
            if (url == "/login")
                this.router.parseUrl('/admin/users');
            // Analizza una stringa URL in un oggetto UrlTree, che può essere utilizzato per analizzare o manipolare l'URL.
            else
                return true;
        } else {
            window.alert('Access Denied. You are not authorized to view this page.');
            return this.router.parseUrl('/');
        }
    }
}