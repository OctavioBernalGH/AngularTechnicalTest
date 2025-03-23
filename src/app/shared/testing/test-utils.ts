import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * Encuentra un elemento por su data-testid
 */
export function findByTestId<T>(fixture: ComponentFixture<T>, testId: string): HTMLElement {
  const debugElement = fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  return debugElement ? debugElement.nativeElement : null;
}

/**
 * Encuentra todos los elementos que coinciden con un data-testid
 */
export function findAllByTestId<T>(fixture: ComponentFixture<T>, testId: string): HTMLElement[] {
  const debugElements = fixture.debugElement.queryAll(By.css(`[data-testid="${testId}"]`));
  return debugElements.map(el => el.nativeElement);
}