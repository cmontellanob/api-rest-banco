import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { BancoSharedModule } from 'app/shared';
import {
  TransaccionComponent,
  TransaccionDetailComponent,
  TransaccionUpdateComponent,
  TransaccionDeletePopupComponent,
  TransaccionDeleteDialogComponent,
  transaccionRoute,
  transaccionPopupRoute
} from './';

const ENTITY_STATES = [...transaccionRoute, ...transaccionPopupRoute];

@NgModule({
  imports: [BancoSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TransaccionComponent,
    TransaccionDetailComponent,
    TransaccionUpdateComponent,
    TransaccionDeleteDialogComponent,
    TransaccionDeletePopupComponent
  ],
  entryComponents: [TransaccionComponent, TransaccionUpdateComponent, TransaccionDeleteDialogComponent, TransaccionDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BancoTransaccionModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
