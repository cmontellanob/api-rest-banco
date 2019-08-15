import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITransaccion } from 'app/shared/model/transaccion.model';
import { AccountService } from 'app/core';
import { TransaccionService } from './transaccion.service';

@Component({
  selector: 'jhi-transaccion',
  templateUrl: './transaccion.component.html'
})
export class TransaccionComponent implements OnInit, OnDestroy {
  transaccions: ITransaccion[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected transaccionService: TransaccionService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.transaccionService
      .query()
      .pipe(
        filter((res: HttpResponse<ITransaccion[]>) => res.ok),
        map((res: HttpResponse<ITransaccion[]>) => res.body)
      )
      .subscribe(
        (res: ITransaccion[]) => {
          this.transaccions = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInTransaccions();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ITransaccion) {
    return item.id;
  }

  registerChangeInTransaccions() {
    this.eventSubscriber = this.eventManager.subscribe('transaccionListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
