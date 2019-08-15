import { Moment } from 'moment';
import { ITransaccion } from 'app/shared/model/transaccion.model';
import { ICliente } from 'app/shared/model/cliente.model';

export const enum Moneda {
  BOB = 'BOB',
  USD = 'USD'
}

export const enum Estado {
  Vigente = 'Vigente',
  Suspendida = 'Suspendida'
}

export interface ICuenta {
  id?: number;
  nroCuenta?: number;
  fechaApertura?: Moment;
  moneda?: Moneda;
  estado?: Estado;
  transaccions?: ITransaccion[];
  cliente?: ICliente;
}

export class Cuenta implements ICuenta {
  constructor(
    public id?: number,
    public nroCuenta?: number,
    public fechaApertura?: Moment,
    public moneda?: Moneda,
    public estado?: Estado,
    public transaccions?: ITransaccion[],
    public cliente?: ICliente
  ) {}
}
