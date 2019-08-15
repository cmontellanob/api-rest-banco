import { Moment } from 'moment';
import { ICuenta } from 'app/shared/model/cuenta.model';

export const enum TipoTransaccion {
  Ingreso = 'Ingreso',
  Egreso = 'Egreso'
}

export interface ITransaccion {
  id?: number;
  fechaTransaccion?: Moment;
  tipoTransaccion?: TipoTransaccion;
  cantidad?: number;
  descripcion?: string;
  cuenta?: ICuenta;
}

export class Transaccion implements ITransaccion {
  constructor(
    public id?: number,
    public fechaTransaccion?: Moment,
    public tipoTransaccion?: TipoTransaccion,
    public cantidad?: number,
    public descripcion?: string,
    public cuenta?: ICuenta
  ) {}
}
