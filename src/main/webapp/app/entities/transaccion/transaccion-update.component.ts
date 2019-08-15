import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { ITransaccion, Transaccion } from 'app/shared/model/transaccion.model';
import { TransaccionService } from './transaccion.service';
import { ICuenta } from 'app/shared/model/cuenta.model';
import { CuentaService } from 'app/entities/cuenta';

@Component({
  selector: 'jhi-transaccion-update',
  templateUrl: './transaccion-update.component.html'
})
export class TransaccionUpdateComponent implements OnInit {
  isSaving: boolean;

  cuentas: ICuenta[];

  editForm = this.fb.group({
    id: [],
    fechaTransaccion: [],
    tipoTransaccion: [],
    cantidad: [],
    descripcion: [],
    cuenta: [null, Validators.required]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected transaccionService: TransaccionService,
    protected cuentaService: CuentaService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ transaccion }) => {
      this.updateForm(transaccion);
    });
    this.cuentaService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICuenta[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICuenta[]>) => response.body)
      )
      .subscribe((res: ICuenta[]) => (this.cuentas = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(transaccion: ITransaccion) {
    this.editForm.patchValue({
      id: transaccion.id,
      fechaTransaccion: transaccion.fechaTransaccion != null ? transaccion.fechaTransaccion.format(DATE_TIME_FORMAT) : null,
      tipoTransaccion: transaccion.tipoTransaccion,
      cantidad: transaccion.cantidad,
      descripcion: transaccion.descripcion,
      cuenta: transaccion.cuenta
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const transaccion = this.createFromForm();
    if (transaccion.id !== undefined) {
      this.subscribeToSaveResponse(this.transaccionService.update(transaccion.id, transaccion));
    } else {
      this.subscribeToSaveResponse(this.transaccionService.create(transaccion));
    }
  }

  private createFromForm(): ITransaccion {
    return {
      ...new Transaccion(),
      id: this.editForm.get(['id']).value,
      fechaTransaccion:
        this.editForm.get(['fechaTransaccion']).value != null
          ? moment(this.editForm.get(['fechaTransaccion']).value, DATE_TIME_FORMAT)
          : undefined,
      tipoTransaccion: this.editForm.get(['tipoTransaccion']).value,
      cantidad: this.editForm.get(['cantidad']).value,
      descripcion: this.editForm.get(['descripcion']).value,
      cuenta: this.editForm.get(['cuenta']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransaccion>>) {
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

  trackCuentaById(index: number, item: ICuenta) {
    return item.id;
  }
}
