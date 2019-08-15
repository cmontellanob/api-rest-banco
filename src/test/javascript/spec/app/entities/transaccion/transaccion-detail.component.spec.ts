/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BancoTestModule } from '../../../test.module';
import { TransaccionDetailComponent } from 'app/entities/transaccion/transaccion-detail.component';
import { Transaccion } from 'app/shared/model/transaccion.model';

describe('Component Tests', () => {
  describe('Transaccion Management Detail Component', () => {
    let comp: TransaccionDetailComponent;
    let fixture: ComponentFixture<TransaccionDetailComponent>;
    const route = ({ data: of({ transaccion: new Transaccion(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BancoTestModule],
        declarations: [TransaccionDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(TransaccionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TransaccionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.transaccion).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
