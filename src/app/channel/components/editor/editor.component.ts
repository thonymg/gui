import {Component, EventEmitter, HostListener, Injector, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ITemplate} from '../../interfaces/template';
import {GeneratorService} from '../../../generator/services/generator.service';
import {StorageService as ModelStorageService, IModel} from '../../../model/model.module';
import {IGeneratorResult} from '../../../generator/interfaces/generator-result';
import {AceService} from '../../../services/ace.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-channel-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  /**
   * The generator service
   *
   * @type {GeneratorService}
   */
  generatorService: GeneratorService;

  /**
   * The generator service
   *
   * @type {ModelStorageService}
   */
  modelStorageService: ModelStorageService;

  /**
   * Template to edit instance
   *
   * @type {ITemplate}
   */
  @Input() template: ITemplate;

  /**
   * Max length allowed for the path
   *
   * @type {number}
   */
  @Input() pathMinLength = 1;

  /**
   * Min length allowed for the path
   *
   * @type {number}
   */
  @Input() pathMaxLength = 64;

  /**
   * @type {FormGroup}
   */
  form: FormGroup;
  /**
   * @type {{minLength: number; maxLength: number}}
   */
  translateParams = {
    minLength: this.pathMinLength,
    maxLength: this.pathMaxLength,
  };

  /**
   * On save event
   *
   * @type {EventEmitter<void>}
   */
  @Output() onSave = new EventEmitter<void>();

  /**
   * On save event
   *
   * @type {EventEmitter<void>}
   */
  @Output() onClose = new EventEmitter<void>();

  /**
   * The edited template
   *
   * @type {ITemplate}
   */
  wip: ITemplate;

  /**
   * Demo models
   */
  models: IModel[];

  /**
   * Demo model
   */
  model: IModel;

  /**
   * Generation results
   */
  result: IGeneratorResult;

  /**
   * Generation error
   */
  error: string;

  /**
   * Denotes if should re-generate on change
   */
  autoGenerate = true;

  /**
   * Text display to prevent reloading
   */
  beforeUnloadWarning: string;

  /**
   * Denotes if the user has unsaved changes (to prevent reload)
   *
   * @type {boolean}
   */
  unsavedChanges = false;

  /**
   * Constructor
   */
  constructor(private formBuilder: FormBuilder,
              private injector: Injector,
              private translateService: TranslateService,
              public aceService: AceService) {
    // Avoid circular dependency
    this.generatorService = this.injector.get(GeneratorService);
    this.modelStorageService = this.injector.get(ModelStorageService);
  }

  /**
   * On init
   */
  ngOnInit() {

    // Update translateParams
    this.translateParams.minLength = this.pathMinLength;
    this.translateParams.maxLength = this.pathMaxLength;

    this.translateService.get('common_unload_warning')
      .subscribe((value) => this.beforeUnloadWarning = value);

    // Clone input template
    this.wip = this.template.clone();

    // Get all models
    this.modelStorageService.list()
      .then((models) => {
        this.models = models;
        if (this.wip.needsModel()) {
          this.model = this.models[0];
        }
        // Generate
        this._generate();
      });

    // Form validator
    this.form = this.formBuilder.group({
      path: new FormControl(this.wip.path, [
        Validators.minLength(this.pathMinLength),
        Validators.maxLength(this.pathMaxLength),
      ])
    });
  }

  /**
   * Called when the user click on save
   */
  didClickSave() {
    this.template.content = this.wip.content;
    this.template.path = this.wip.path;
    this.unsavedChanges = false;
    this.onSave.emit();
  }

  /**
   * Called when the user click on close
   */
  didClickClose() {
    this.onClose.emit();
  }

  /**
   * Runs the content generation
   *
   * @private
   */
  private _generate() {
    // Clean results and error
    this.result = null;
    this.error = null;
    // Run generation
    this.generatorService.run(this.wip, this.model)
      .then((result) => {
        this.result = result;
      })
      .catch((e) => {
        this.error = `${e.message}\n\n${e.stack}`;
      });
  }

  /**
   * Call when the selected model is changed
   */
  onModelChange() {
    this._generate();
  }

  /**
   * Call when the content is left
   *
   * @param {string} content
   */
  onBlur(content: string) {
    this.wip.content = content;
    this._generate();
  }

  /**
   * Call when the content changes
   *
   * @param {string} content
   */
  onChange(content: string) {
    this.wip.content = content;
    this.unsavedChanges = true;
    if (this.autoGenerate) {
      this._generate();
    }
  }

  /**
   * Call when the user click on "dump"
   */
  async didClickDump() {
    console.log(await this.generatorService.inputs(this.model));
  }

  /**
   * Prevent reloading
   *
   * @param event
   * @return {string|null}
   */
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any): string {
    if (!this.unsavedChanges) {
      return;
    }
    event.returnValue = this.beforeUnloadWarning;
    return this.beforeUnloadWarning;
  }

}
