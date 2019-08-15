/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BancoTestModule } from '../../../test.module';
import { TransaccionDeleteDialogComponent } from 'app/entities/transaccion/transaccion-delete-dialog.component';
import { TransaccionService } from 'app/entities/transaccion/transaccion.service';

describe('Component Tests', () => {
  describe('Transaccion Management Delete Component', () => {
    let comp: TransaccionDeleteDialogComponent;
    let fixture: ComponentFixture<TransaccionDeleteDialogComponent>;
    let service: TransaccionService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BancoTestModule],
        declarations: [TransaccionDeleteDialogComponent]
      })
        .overrideTemplate(TransaccionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TransaccionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TransaccionService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
