import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LangService {
    currentLang = signal<'en' | 'ka' | 'ru' | 'es' | 'zh'>('en');
  private translations: Record<string, any> ={}
    isLoaded = signal(false)
    
    constructor(private http: HttpClient){
      const savedLang = (localStorage.getItem('lang') as 'en' | 'ka' | 'ru' | 'es' | 'zh') || 'en'
      this.currentLang.set(savedLang)
      this.loadTranslations(this.currentLang())

    }
    setLanguage(lang: 'en' | 'ka' | 'ru' | 'es' | 'zh'){
      this.currentLang.set(lang)
      localStorage.setItem('lang', lang)

      this.loadTranslations(lang)

    }

    loadTranslations(lang: string){
      this.isLoaded.set(false)


      return this.http.get(`/assets/i18n/${lang}.json`).subscribe({
        next: (data: any) => {
          this.translations = data as Record<string, any>
          this.isLoaded.set(true)
        },
        error: (err) => console.error(err)
        
      })
    }

    translate(key: string){
      const result = key.split('.').reduce((obj:any, k: string) => obj?.[k], this.translations as {})
      return (typeof result === 'string' ? result : null) ?? key
    }
}
