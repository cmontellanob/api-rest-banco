import { ICuenta } from 'app/shared/model/cuenta.model';

export interface ICliente {
  id?: number;
  documentoIdentidad?: number;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  correo?: string;
  celular?: string;
  cuentas?: ICuenta[];
}

export class Cliente implements ICliente {
  constructor(
    public id?: number,
    public documentoIdentidad?: number,
    public nombres?: string,
    public primerApellido?: string,
    public segundoApellido?: string,
    public correo?: string,
    public celular?: string,
    public cuentas?: ICuenta[]
  ) {}
}
