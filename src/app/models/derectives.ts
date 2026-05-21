import { Directive, ElementRef, HostBinding, HostListener, Input, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDerectives]',
  standalone: true
})
export class Derectives {

  @Input('appDerectives') targetElement!: HTMLElement ;
  
  constructor(private renderer: Renderer2) {}

@HostListener('mouseenter') onMouseEnter() {
    if (this.targetElement) {
      this.renderer.setStyle(this.targetElement, 'display', 'flex');
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.targetElement) {
      this.renderer.setStyle(this.targetElement, 'display', 'none');
    }
  }


}
