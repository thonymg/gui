import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import {IModel} from '../../interfaces/model';
import {Context} from '../../interfaces/context';
import {ILabelledValue} from '../../interfaces/labelled-value';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';

@Component({
  selector: 'app-model-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, OnDestroy {

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder,
              private hotKeysService: HotkeysService) {
  }

  /** @type {IModel} Model instance */
  @Input() model: IModel;
  /** @type {EventEmitter<void>} On save event */
  @Output() onSave = new EventEmitter<void>();
  /** @type {EventEmitter<void>} Notify changes */
  @Output() onChange = new EventEmitter<void>();
  /** @type {FormGroup} */
  form: FormGroup;
  /** @type {number} */
  minLength = 2;
  /** @type {number} */
  maxLength = 32;
  /** @type {{minLength: number; maxLength: number}} */
  translateParams = {
    minLength: this.minLength,
    maxLength: this.maxLength,
  };
  /** @type {number} The debounce delay before triggering the event */
  private debounceTimeDelay = 300;
  /** @type {Subject<void>} Subject for debounced keyup event */
  private keyupSubject = new Subject<void>();
  /** @type {Subscription[]} Subscription of the component */
  private subscriptions: Subscription[] = [];
  /** @type {boolean} Denotes if the user has unsaved changes (to prevent reload) */
  unsavedChanges = false;
  /** @type{Hotkey|Hotkey[]} Hotkeys to unbind */
  private saveHotKeys: Hotkey|Hotkey[];
  /** @type {ILabelledValue[]} Available contexts */
  contexts: ILabelledValue[] = [
    {name: 'Admin', value: Context.ADMIN},
    {name: 'Owner', value: Context.OWNER},
    {name: 'Authenticated', value: Context.AUTHENTICATED},
    {name: 'Guest', value: Context.GUEST},
  ];
  
  /**
   * @inheritDoc
   */
  ngOnInit() {
    // Subscriptions
    this.subscriptions = [
      this.keyupSubject
        .pipe(debounceTime<void>(this.debounceTimeDelay))
        .subscribe(() => {
          this.onModelChange();
        })
    ];
    // Form validator
    this.form = this.formBuilder.group({
      name: new FormControl(this.model.name, [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength),
      ]),
    });
    // Save on Ctrl+S
    this.saveHotKeys = this.hotKeysService.add(new Hotkey('meta+s', (event: KeyboardEvent): boolean => {
      this.onSubmit();
      return false;
    }));
  }

  /**
   * Destroy
   */
  ngOnDestroy() {
    this.hotKeysService.remove(this.saveHotKeys);
    this.subscriptions.map((s) => s.unsubscribe());
  }

  /**
   * Called when the user click on "save"
   */
  onSubmit() {
    this.onSave.emit();
    this.unsavedChanges = false;
  }

  /**
   * Called when the user click on "add field"
   */
  addField() {
    this.model.addField(this.model.newField());
    this.onModelChange();
  }

  /**
   * Called when the user click on "clean fields"
   */
  cleanFields() {
    this.model.filter();
    this.onModelChange();
  }

  /**
   * Called when a field change
   */
  onModelChange() {
    this.onChange.emit();
    this.unsavedChanges = true;
  }

  /**
   * Called when a value change and should be debounced
   */
  onDebouncedChange(): void {
    this.keyupSubject.next();
  }

  /**
   * Called when the user changes a context
   */
  onContextChange(action: string, context: ILabelledValue): void {
    this.model.contexts[action] = context.value;
  }
  /**
   * Get available actions for this model
   * @return {string[]}
   */
  getActions(): string[] {
    return Object.keys(this.model.contexts);
  }
  /**
   * Denotes if the context should be highlighted
   * @return {boolean}
   */
  isContextSelected(action: string, context: ILabelledValue): boolean {
    return this.contextPosition(this.model.contexts[action]) >= this.contextPosition(context.value);
  }

  /**
   * Get the position in importance
   * @param name
   * @return {number}
   */
  contextPosition(name): number {
    if (name === Context.ADMIN) { return 0; }
    if (name === Context.OWNER) { return 1; }
    if (name === Context.AUTHENTICATED) { return 2; }
    if (name === Context.GUEST) { return 3; }
    return -1;
  }
}
