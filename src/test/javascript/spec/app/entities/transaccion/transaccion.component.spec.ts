/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BancoTestModule } from '../../../test.module';
import { TransaccionComponent } from 'app/entities/transaccion/transaccion.component';
import { TransaccionService } from 'app/entities/transaccion/transaccion.service';
import { Transaccion } from 'app/shared/model/transaccion.model';

describe('Component Tests', () => {
  describe('Transaccion Management Component', () => {
    let comp: TransaccionComponent;
    let fixture: ComponentFixture<TransaccionComponent>;
    let service: TransaccionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BancoTestModule],
        declarations: [TransaccionComponent],
        providers: []
      })
        .overrideTemplate(TransaccionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransaccionComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TransaccionService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Transaccion(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.transaccions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
