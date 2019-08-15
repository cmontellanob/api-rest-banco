/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { CuentaService } from 'app/entities/cuenta/cuenta.service';
import { ICuenta, Cuenta, Moneda, Estado } from 'app/shared/model/cuenta.model';

describe('Service Tests', () => {
  describe('Cuenta Service', () => {
    let injector: TestBed;
    let service: CuentaService;
    let httpMock: HttpTestingController;
    let elemDefault: ICuenta;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(CuentaService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Cuenta(0, 0, currentDate, Moneda.BOB, Estado.Vigente);
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            fechaApertura: currentDate.format(DATE_TIME_FORMAT)
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

      it('should create a Cuenta', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fechaApertura: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            fechaApertura: currentDate
          },
          returnedFromService
        );
        service
          .create(new Cuenta(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Cuenta', async () => {
        const returnedFromService = Object.assign(
          {
            nroCuenta: 1,
            fechaApertura: currentDate.format(DATE_TIME_FORMAT),
            moneda: 'BBBBBB',
            estado: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaApertura: currentDate
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

      it('should return a list of Cuenta', async () => {
        const returnedFromService = Object.assign(
          {
            nroCuenta: 1,
            fechaApertura: currentDate.format(DATE_TIME_FORMAT),
            moneda: 'BBBBBB',
            estado: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            fechaApertura: currentDate
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

      it('should delete a Cuenta', async () => {
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
