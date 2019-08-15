import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITransaccion } from 'app/shared/model/transaccion.model';
import { TransaccionService } from './transaccion.service';

@Component({
  selector: 'jhi-transaccion-delete-dialog',
  templateUrl: './transaccion-delete-dialog.component.html'
})
export class TransaccionDeleteDialogComponent {
  transaccion: ITransaccion;

  constructor(
    protected transaccionService: TransaccionService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.transaccionService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'transaccionListModification',
        content: 'Deleted an transaccion'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-transaccion-delete-popup',
  template: ''
})
export class TransaccionDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ transaccion }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(TransaccionDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.transaccion = transaccion;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/transaccion', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/transaccion', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
