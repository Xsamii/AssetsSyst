import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private loginService: AuthService
    , private router: Router
  ) { }

  // canActivate(): boolean {

  //   return this.checkAuth();
  // }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;
    return this.checkAuth(next, url);
  }

  // canActivateChild(): boolean {
  //   return this.checkAuth();
  // }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.canActivate(next, state);
  }

  canDeactivate(component): boolean {
    if (component.hasUnsavedChanges()) {
      return window.confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }




  private checkAuth(route: ActivatedRouteSnapshot, url: string): boolean {

    if (this.loginService.isAuthenticatedUser()) {
      const userRole = +this.loginService.getPermissions();

      if (route.data["role"] && route.data["role"].indexOf(userRole) === -1) {
        // to route to an access denied page
        this.router.navigate(['/'])

        return false;
      }
      if (url == "/") {
        // let def = this.menuService.getFirstVisibleRoute()
        // this.router.navigate([def]);
        this.router.navigate(['/'])

        return true;
      }

      return true;
    }
    return false;
  }
}
