/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BancoTestModule } from '../../../test.module';
import { CuentaDetailComponent } from 'app/entities/cuenta/cuenta-detail.component';
import { Cuenta } from 'app/shared/model/cuenta.model';

describe('Component Tests', () => {
  describe('Cuenta Management Detail Component', () => {
    let comp: CuentaDetailComponent;
    let fixture: ComponentFixture<CuentaDetailComponent>;
    const route = ({ data: of({ cuenta: new Cuenta(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BancoTestModule],
        declarations: [CuentaDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CuentaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CuentaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cuenta).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
