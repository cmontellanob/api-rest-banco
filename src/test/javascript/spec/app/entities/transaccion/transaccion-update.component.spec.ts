/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { BancoTestModule } from '../../../test.module';
import { TransaccionUpdateComponent } from 'app/entities/transaccion/transaccion-update.component';
import { TransaccionService } from 'app/entities/transaccion/transaccion.service';
import { Transaccion } from 'app/shared/model/transaccion.model';

describe('Component Tests', () => {
  describe('Transaccion Management Update Component', () => {
    let comp: TransaccionUpdateComponent;
    let fixture: ComponentFixture<TransaccionUpdateComponent>;
    let service: TransaccionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BancoTestModule],
        declarations: [TransaccionUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TransaccionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransaccionUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TransaccionService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Transaccion(123);
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
        const entity = new Transaccion();
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
