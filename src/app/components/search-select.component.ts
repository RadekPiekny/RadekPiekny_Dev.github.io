import { Component, OnInit, forwardRef, Input, Output, EventEmitter, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { tap, map, debounceTime, switchMap, startWith } from 'rxjs/operators';
import { Subject, Subscription, Observable, of, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectComponent),
      multi: true
    }
  ]
})
export class SearchSelectComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('fakeInputValue') fakeInputValue: ElementRef;
  @Input() set value(val: any) {
    this._value = val;
  }
  @Input() border: boolean = true; 
  @Input() display: string = "flex"; 
  @Input() label: string;
  @Input() list: any[];
  @Input() displayProperty: any[]; //what will be visible in the input
  @Input() displayPropertySeparator: string = " - ";
  @Input() valueProperty: string; //what will be the real value for backend etc. !!!!!!!!!!!! IF "obj" is specified then it returns whole selected object
  searchTerm$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filteredData$: Observable<any[]> = this.searchTerm$.asObservable().pipe(
    switchMap(val => of(this.filterData(val))),
    tap(val => console.log(val))
  );
  searchSubscription: Subscription;
  @Output() searchTerm: EventEmitter<string> = new EventEmitter<string>();
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  _value: any;
  openList: boolean = false;
  displayData: any;
  listWindowStyle: Object;

  onChange(val: any) {
    console.log("wtt");
  }; 
  onTouched: () => void; 
  disabled: boolean;

  constructor(private hostElement: ElementRef) { }

  writeValue(value: any): void {
     this._value = value[Object.keys(value)[0]];
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {
    this.searchSubscription = this.searchTerm$.pipe(
      debounceTime(400),
      tap((searchTerm: string) => this.searchTerm.emit(searchTerm))
    ).subscribe();

  }

  ngAfterViewInit(): void {
    const rect: DOMRect = this.fakeInputValue.nativeElement.getBoundingClientRect();
    const width: number = rect.width < 180 ? 180 : rect.width; // 180 is in css as min width
    const left: number = ((rect.left + width) > window.innerWidth) ? (window.innerWidth - width - 32) : rect.left;
    this.listWindowStyle = {
      top: rect.top + rect.height + 5 + 'px',
      width: width + 'px',
      left: left + 'px'
    }
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  search(searchTerm: string) {
    this.searchTerm.emit(searchTerm);
  }

  changeValue(item: any) {
      this._value = item;
      this.openList = false;
      if (this.valueProperty === "obj") {
        this.valueChange.emit(item);
        this.onChange(item);
      } else {
        this.valueChange.emit(item[this.valueProperty])
        this.onChange(item[this.valueProperty]);
      }
  }

  getDisplayValue(val: any): string {
    if (typeof val === 'object') {
      let displayValue = this.displayProperty.reduce((acc, item) => {
          return acc + this.displayPropertySeparator + val[item]
      }, "");
      displayValue = displayValue.substring(3);
      return displayValue;
    }
    return val;
  }

  filterData(searchTerm: string): any[] {
    searchTerm = searchTerm.toLowerCase();
    let result: any[];
    if (this.list.length > 0) {
      switch (typeof this.list[0]) {
        case 'object':
          result = this.list.filter(val => this.valueFound(searchTerm,val,this.displayProperty))
          break;
        case 'string':
          result = this.list.filter((val:string) => val.toLowerCase().includes(searchTerm))
          break;
        case 'number':
          result = this.list.filter((val:number) => val.toString().includes(searchTerm) || searchTerm == "")
          break;
        default:
          break;
      }
    };
    return result;
}

valueFound (searchString: string, obj: Object, searchProperty?: string[]): Boolean {
  let result: any[];
  result = Object.keys(obj as Object).filter(prop => {
    if (searchProperty) {
      if (searchProperty.filter(searchProp => searchProp === prop)) {
        if (typeof obj[prop] === 'string') {
          if (obj[prop].toLocaleLowerCase().includes(searchString)) {
            return true
          }
          return false;
        }
      }
    } else {
      if (typeof obj[prop] === 'string') {
        if (obj[prop].toLocaleLowerCase().includes(searchString)) {
          return true
        }
        return false;
      }
    }
  })
  return result.length > 0 ? true : false;
}

}
