import { Directive, Input, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: 'iframe',
})
export class CachedSrcDirective {
  @Input()
  public get cachedSrc(): string {
    return this.elRef.nativeElement.src;
  }
  public set cachedSrc(src: any) {
    if (this.elRef.nativeElement.src !== src) {
      this.renderer.setAttribute(this.elRef.nativeElement, 'src', src);
    }
  }

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}
}
