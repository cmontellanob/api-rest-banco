/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { TransaccionService } from 'app/entities/transaccion/transaccion.service';
import { ITransaccion, Transaccion, TipoTransaccion } from 'app/shared/model/transaccion.model';

describe('Service Tests', () => {
  describe('Transaccion Service', () => {
    let injector: TestBed;
    let service: TransaccionService;
    let httpMock: HttpTestingController;
    let elemDefault: ITransaccion;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(TransaccionService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Transaccion(0, currentDate, TipoTransaccion.Ingreso, 0, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            fechaTransaccion: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a Transaccion', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fechaTransaccion: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            fechaTransaccion: currentDate
          },
          returnedFromService
        );
        service
          .create(new Transaccion(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Transaccion', async () => {
        const returnedFromService = Object.assign(
          {
            fechaTransaccion: currentDate.format(DATE_TIME_FORMAT),
            tipoTransaccion: 'BBBBBB',
            cantidad: 1,
            descripcion: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaTransaccion: currentDate
          },
          returnedFromService
        );
        service
          .update(123, expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of Transaccion', async () => {
        const returnedFromService = Object.assign(
          {
            fechaTransaccion: currentDate.format(DATE_TIME_FORMAT),
            tipoTransaccion: 'BBBBBB',
            cantidad: 1,
            descripcion: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            fechaTransaccion: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Transaccion', async () => {
        const rxPromise = service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
