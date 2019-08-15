import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICuenta } from 'app/shared/model/cuenta.model';

@Component({
  selector: 'jhi-cuenta-detail',
  templateUrl: './cuenta-detail.component.html'
})
export class CuentaDetailComponent implements OnInit {
  cuenta: ICuenta;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ cuenta }) => {
      this.cuenta = cuenta;
    });
  }

  previousState() {
    window.history.back();
  }
}
