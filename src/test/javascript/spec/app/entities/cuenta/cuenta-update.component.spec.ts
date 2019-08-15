/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { BancoTestModule } from '../../../test.module';
import { CuentaUpdateComponent } from 'app/entities/cuenta/cuenta-update.component';
import { CuentaService } from 'app/entities/cuenta/cuenta.service';
import { Cuenta } from 'app/shared/model/cuenta.model';

describe('Component Tests', () => {
  describe('Cuenta Management Update Component', () => {
    let comp: CuentaUpdateComponent;
    let fixture: ComponentFixture<CuentaUpdateComponent>;
    let service: CuentaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BancoTestModule],
        declarations: [CuentaUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CuentaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CuentaUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CuentaService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Cuenta(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Cuenta();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
