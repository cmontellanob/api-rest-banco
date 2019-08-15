import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITransaccion } from 'app/shared/model/transaccion.model';

@Component({
  selector: 'jhi-transaccion-detail',
  templateUrl: './transaccion-detail.component.html'
})
export class TransaccionDetailComponent implements OnInit {
  transaccion: ITransaccion;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ transaccion }) => {
      this.transaccion = transaccion;
    });
  }

  previousState() {
    window.history.back();
  }
}
