import { ElementRef } from '@angular/core';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNewline]',
})
export class NewlineDirective {
  constructor(private eleRef: ElementRef) {}

  @HostListener('keydown.shift.enter', ['$event']) onKeyDown(e: KeyboardEvent) {
    if (e.shiftKey && e.key === 'Enter') {
      console.log('shift ');
    }
  }
}
