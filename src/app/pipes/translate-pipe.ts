import { Pipe, PipeTransform } from '@angular/core';
import { LangService } from '../services/lang-service';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
constructor( private langService: LangService){}
transform(key: string, params?: Record<string, string>): string {
  this.langService.currentLang();
  this.langService.isLoaded();

  let value = this.langService.translate(key);

  if (params && value) {
    Object.keys(params).forEach(param => {
      value = value.replace(`{{${param}}}`, params[param]);
    });
  }

  return value;
}
}
