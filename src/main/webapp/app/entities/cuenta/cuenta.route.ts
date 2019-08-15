import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Cuenta } from 'app/shared/model/cuenta.model';
import { CuentaService } from './cuenta.service';
import { CuentaComponent } from './cuenta.component';
import { CuentaDetailComponent } from './cuenta-detail.component';
import { CuentaUpdateComponent } from './cuenta-update.component';
import { CuentaDeletePopupComponent } from './cuenta-delete-dialog.component';
import { ICuenta } from 'app/shared/model/cuenta.model';

@Injectable({ providedIn: 'root' })
export class CuentaResolve implements Resolve<ICuenta> {
  constructor(private service: CuentaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICuenta> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Cuenta>) => response.ok),
        map((cuenta: HttpResponse<Cuenta>) => cuenta.body)
      );
    }
    return of(new Cuenta());
  }
}

export const cuentaRoute: Routes = [
  {
    path: '',
    component: CuentaComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'bancoApp.cuenta.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CuentaDetailComponent,
    resolve: {
      cuenta: CuentaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.cuenta.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CuentaUpdateComponent,
    resolve: {
      cuenta: CuentaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.cuenta.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CuentaUpdateComponent,
    resolve: {
      cuenta: CuentaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.cuenta.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const cuentaPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CuentaDeletePopupComponent,
    resolve: {
      cuenta: CuentaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.cuenta.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
