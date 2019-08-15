import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITransaccion } from 'app/shared/model/transaccion.model';

type EntityResponseType = HttpResponse<ITransaccion>;
type EntityArrayResponseType = HttpResponse<ITransaccion[]>;

@Injectable({ providedIn: 'root' })
export class TransaccionService {
  public resourceUrl = SERVER_API_URL + 'api/transaccions';

  constructor(protected http: HttpClient) {}

  create(transaccion: ITransaccion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transaccion);
    return this.http
      .post<ITransaccion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(id: number, transaccion: ITransaccion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transaccion);
    return this.http
      .put<ITransaccion>(`${this.resourceUrl}/${id}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITransaccion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITransaccion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(transaccion: ITransaccion): ITransaccion {
    const copy: ITransaccion = Object.assign({}, transaccion, {
      fechaTransaccion:
        transaccion.fechaTransaccion != null && transaccion.fechaTransaccion.isValid() ? transaccion.fechaTransaccion.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaTransaccion = res.body.fechaTransaccion != null ? moment(res.body.fechaTransaccion) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((transaccion: ITransaccion) => {
        transaccion.fechaTransaccion = transaccion.fechaTransaccion != null ? moment(transaccion.fechaTransaccion) : null;
      });
    }
    return res;
  }
}
