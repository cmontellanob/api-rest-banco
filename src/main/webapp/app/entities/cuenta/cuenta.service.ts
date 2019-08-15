import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICuenta } from 'app/shared/model/cuenta.model';

type EntityResponseType = HttpResponse<ICuenta>;
type EntityArrayResponseType = HttpResponse<ICuenta[]>;

@Injectable({ providedIn: 'root' })
export class CuentaService {
  public resourceUrl = SERVER_API_URL + 'api/cuentas';

  constructor(protected http: HttpClient) {}

  create(cuenta: ICuenta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cuenta);
    return this.http
      .post<ICuenta>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(id: number, cuenta: ICuenta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cuenta);
    return this.http
      .put<ICuenta>(`${this.resourceUrl}/${id}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICuenta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICuenta[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(cuenta: ICuenta): ICuenta {
    const copy: ICuenta = Object.assign({}, cuenta, {
      fechaApertura: cuenta.fechaApertura != null && cuenta.fechaApertura.isValid() ? cuenta.fechaApertura.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaApertura = res.body.fechaApertura != null ? moment(res.body.fechaApertura) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((cuenta: ICuenta) => {
        cuenta.fechaApertura = cuenta.fechaApertura != null ? moment(cuenta.fechaApertura) : null;
      });
    }
    return res;
  }
}
