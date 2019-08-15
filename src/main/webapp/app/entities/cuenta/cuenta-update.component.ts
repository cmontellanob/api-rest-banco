import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { ICuenta, Cuenta } from 'app/shared/model/cuenta.model';
import { CuentaService } from './cuenta.service';
import { ICliente } from 'app/shared/model/cliente.model';
import { ClienteService } from 'app/entities/cliente';

@Component({
  selector: 'jhi-cuenta-update',
  templateUrl: './cuenta-update.component.html'
})
export class CuentaUpdateComponent implements OnInit {
  isSaving: boolean;

  clientes: ICliente[];

  editForm = this.fb.group({
    id: [],
    nroCuenta: [null, [Validators.required]],
    fechaApertura: [],
    moneda: [],
    estado: [],
    cliente: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected cuentaService: CuentaService,
    protected clienteService: ClienteService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ cuenta }) => {
      this.updateForm(cuenta);
    });
    this.clienteService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICliente[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICliente[]>) => response.body)
      )
      .subscribe((res: ICliente[]) => (this.clientes = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(cuenta: ICuenta) {
    this.editForm.patchValue({
      id: cuenta.id,
      nroCuenta: cuenta.nroCuenta,
      fechaApertura: cuenta.fechaApertura != null ? cuenta.fechaApertura.format(DATE_TIME_FORMAT) : null,
      moneda: cuenta.moneda,
      estado: cuenta.estado,
      cliente: cuenta.cliente
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const cuenta = this.createFromForm();
    if (cuenta.id !== undefined) {
      this.subscribeToSaveResponse(this.cuentaService.update(cuenta.id, cuenta));
    } else {
      this.subscribeToSaveResponse(this.cuentaService.create(cuenta));
    }
  }

  private createFromForm(): ICuenta {
    return {
      ...new Cuenta(),
      id: this.editForm.get(['id']).value,
      nroCuenta: this.editForm.get(['nroCuenta']).value,
      fechaApertura:
        this.editForm.get(['fechaApertura']).value != null
          ? moment(this.editForm.get(['fechaApertura']).value, DATE_TIME_FORMAT)
          : undefined,
      moneda: this.editForm.get(['moneda']).value,
      estado: this.editForm.get(['estado']).value,
      cliente: this.editForm.get(['cliente']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICuenta>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackClienteById(index: number, item: ICliente) {
    return item.id;
  }
}
