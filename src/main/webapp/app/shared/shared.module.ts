import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BancoSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [BancoSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [BancoSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BancoSharedModule {
  static forRoot() {
    return {
      ngModule: BancoSharedModule
    };
  }
}
