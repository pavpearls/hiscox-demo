import { NgFor } from "@angular/common";
import { forwardRef, Input, Output, EventEmitter, Component } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";

@Component({
    selector: 'nz-select-dropdown-with-add-option',
    standalone: true,
    imports: [NzDividerModule, NzIconModule, NzInputModule, NzSelectModule, NgFor, FormsModule],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectDropdownWithAddOptionComponent),
        multi: true,
      },
    ],
    template: `
      <nz-select
        nzShowSearch
        nzAllowClear
        [nzDropdownRender]="renderTemplate"
        [nzPlaceHolder]="'Select an option'"
        [(ngModel)]="value"
        (ngModelChange)="onModelChange($event)"
      >
        <nz-option
          *ngFor="let item of listOfItems; trackBy: trackByValue"
          [nzLabel]="item"
          [nzValue]="item"
        ></nz-option>
      </nz-select>
      <ng-template #renderTemplate>
        <nz-divider></nz-divider>
        <div class="container">
          <input type="text" nz-input #inputElement (keydown.enter)="addItem(inputElement)" placeholder="Add new item" />
          <a class="add-item" (click)="addItem(inputElement)">
            <span nz-icon nzType="plus"></span>
            {{ buttonLabel }}
          </a>
        </div>
      </ng-template>
    `,
    styles: [
      `
        nz-select {
          width: 240px;
        }
        nz-divider {
          margin: 4px 0;
        }
        .container {
          display: flex;
          flex-wrap: nowrap;
          padding: 8px;
        }
        .add-item {
          flex: 0 0 auto;
          padding: 8px;
          display: block;
        }
      `,
    ],
  })
  export class SelectDropdownWithAddOptionComponent implements ControlValueAccessor {
    @Input() listOfItems: Array<string | number> = [];
    @Input() buttonLabel: string = 'Add item';
  
    @Output() itemAdded = new EventEmitter<string | number>();
  
    value: string | number | null = null;
  
    onChange: (value: string | number | null) => void = () => {};
    onTouched: () => void = () => {};
  
    writeValue(value: string | number | null): void {
      this.value = value;
    }
  
    registerOnChange(fn: (value: string | number | null) => void): void {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
    }
  
    setDisabledState(isDisabled: boolean): void {}
  
    addItem(input: HTMLInputElement): void {
      const rawValue = input.value.trim();
  
      if (!rawValue) {
        alert('Item is required!');
        return;
      }
  
      let parsedValue: string | number;
  
      if (!isNaN(Number(rawValue))) {
        parsedValue = Number(rawValue);
      } else {
        parsedValue = rawValue;
      }
  
      if (this.listOfItems.some(item => item.toString() === parsedValue.toString())) {
        alert('Item already exists!');
        return;
      }
  
      this.listOfItems = [...this.listOfItems, parsedValue];
      input.value = '';
  
      this.itemAdded.emit(parsedValue);
      this.onChange(parsedValue);
    }
  
    trackByValue(_: number, item: string | number): string {
      return item.toString();
    }
  
    onModelChange(value: string | number | null): void {
      this.value = value;
      this.onChange(value);
    }
  }
  