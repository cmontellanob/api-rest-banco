import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Transaccion } from 'app/shared/model/transaccion.model';
import { TransaccionService } from './transaccion.service';
import { TransaccionComponent } from './transaccion.component';
import { TransaccionDetailComponent } from './transaccion-detail.component';
import { TransaccionUpdateComponent } from './transaccion-update.component';
import { TransaccionDeletePopupComponent } from './transaccion-delete-dialog.component';
import { ITransaccion } from 'app/shared/model/transaccion.model';

@Injectable({ providedIn: 'root' })
export class TransaccionResolve implements Resolve<ITransaccion> {
  constructor(private service: TransaccionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITransaccion> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Transaccion>) => response.ok),
        map((transaccion: HttpResponse<Transaccion>) => transaccion.body)
      );
    }
    return of(new Transaccion());
  }
}

export const transaccionRoute: Routes = [
  {
    path: '',
    component: TransaccionComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.transaccion.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TransaccionDetailComponent,
    resolve: {
      transaccion: TransaccionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.transaccion.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TransaccionUpdateComponent,
    resolve: {
      transaccion: TransaccionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.transaccion.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TransaccionUpdateComponent,
    resolve: {
      transaccion: TransaccionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.transaccion.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const transaccionPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: TransaccionDeletePopupComponent,
    resolve: {
      transaccion: TransaccionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'bancoApp.transaccion.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
