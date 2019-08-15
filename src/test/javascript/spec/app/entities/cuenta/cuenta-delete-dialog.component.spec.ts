/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BancoTestModule } from '../../../test.module';
import { CuentaDeleteDialogComponent } from 'app/entities/cuenta/cuenta-delete-dialog.component';
import { CuentaService } from 'app/entities/cuenta/cuenta.service';

describe('Component Tests', () => {
  describe('Cuenta Management Delete Component', () => {
    let comp: CuentaDeleteDialogComponent;
    let fixture: ComponentFixture<CuentaDeleteDialogComponent>;
    let service: CuentaService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BancoTestModule],
        declarations: [CuentaDeleteDialogComponent]
      })
        .overrideTemplate(CuentaDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CuentaDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CuentaService);
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
