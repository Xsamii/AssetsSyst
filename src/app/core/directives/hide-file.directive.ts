import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHideFile]'
})
export class HideFileDirective {
  @Input('appHideFile') hide: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.hide) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'display');
    }
  }
}
