import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  // This provider registers our component as a valid form control
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThemeToggleComponent),
      multi: true
    }
  ]
})
export class ThemeToggleComponent implements ControlValueAccessor {
  isChecked = false;

  // These functions are placeholders for the callbacks that the Forms API will give us.
  onChange: any = (value: boolean) => { };
  onTouched: any = () => { };

  /**
   * Called by the Forms API to write a value into our component.
   */
  writeValue(value: boolean): void {
    this.isChecked = value;
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * This method is called by the <input> in our template whenever the user clicks it.
   */
  onToggleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.checked;

    // Update our internal state
    this.isChecked = value;

    // Notify the Angular Forms API that the value has changed.
    this.onChange(this.isChecked);

    // Notify the Angular Forms API that the control has been "touched".
    this.onTouched();
  }
}