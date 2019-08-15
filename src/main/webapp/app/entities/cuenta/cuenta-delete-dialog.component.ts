import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICuenta } from 'app/shared/model/cuenta.model';
import { CuentaService } from './cuenta.service';

@Component({
  selector: 'jhi-cuenta-delete-dialog',
  templateUrl: './cuenta-delete-dialog.component.html'
})
export class CuentaDeleteDialogComponent {
  cuenta: ICuenta;

  constructor(protected cuentaService: CuentaService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.cuentaService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'cuentaListModification',
        content: 'Deleted an cuenta'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-cuenta-delete-popup',
  template: ''
})
export class CuentaDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ cuenta }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CuentaDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.cuenta = cuenta;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/cuenta', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/cuenta', { outlets: { popup: null } }]);
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
