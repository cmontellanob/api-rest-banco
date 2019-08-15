import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cliente',
        loadChildren: () => import('./cliente/cliente.module').then(m => m.BancoClienteModule)
      },
      {
        path: 'cuenta',
        loadChildren: () => import('./cuenta/cuenta.module').then(m => m.BancoCuentaModule)
      },
      {
        path: 'transaccion',
        loadChildren: () => import('./transaccion/transaccion.module').then(m => m.BancoTransaccionModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BancoEntityModule {}
