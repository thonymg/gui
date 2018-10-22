import {IField, IFieldBase} from '../interfaces/field';
import {ILabelledValue} from '../interfaces/labelled-value';
import {FieldType} from './field-type';
import {FieldSubType} from './field-subtype';

export class Field implements IField {
  /** Constructor */
  constructor() {
  }

  /** @inheritDoc */
  public name = '';
  /** @inheritDoc */
  public type = FieldType.String;
  /** @inheritDoc */
  public subtype = FieldSubType.String.Default;
  /** @inheritDoc */
  public reference = null;
  /** @inheritDoc */
  public primary = false;
  /** @inheritDoc */
  public unique = false;
  /** @inheritDoc */
  public label = false;
  /** @inheritDoc */
  public nullable = false;
  /** @inheritDoc */
  public multiple = false;
  /** @inheritDoc */
  public important = false;
  /** @inheritDoc */
  public searchable = false;
  /** @inheritDoc */
  public sortable = false;
  /** @inheritDoc */
  public isPrivate = false;
  /** @inheritDoc */
  public internal = false;
  /** @inheritDoc */
  public restricted = false;
  /** @inheritDoc */
  public ownership = false;

  /** @inheritDoc */
  public fromObject(object: IFieldBase): void {
    this.name = object.name;
    this.type = object.type;
    this.subtype = object.subtype;
    this.reference = object.reference;
    this.primary = !!<any>object.primary;
    this.unique = !!<any>object.unique;
    this.label = !!<any>object.label;
    this.nullable = !!<any>object.nullable;
    this.multiple = !!<any>object.multiple;
    this.important = !!<any>object.important;
    this.searchable = !!<any>object.searchable;
    this.sortable = !!<any>object.sortable;
    this.isPrivate = !!<any>object.isPrivate;
    this.internal = !!<any>object.internal;
    this.restricted = !!<any>object.restricted;
    this.ownership = !!<any>object.ownership;
  }

  /** @inheritDoc */
  public toObject(): IFieldBase {
    return {
      name: this.name,
      type: this.type,
      subtype: this.subtype,
      reference: this.type === FieldType.Entity ? this.reference : null,
      primary: this.primary,
      unique: this.unique,
      label: this.label,
      nullable: this.nullable,
      multiple: this.multiple,
      important: this.important,
      searchable: this.searchable,
      sortable: this.sortable,
      isPrivate: this.isPrivate,
      internal: this.internal,
      restricted: this.restricted,
      ownership: this.ownership
    };
  }

  /** @inheritDoc */
  public isEmpty(): boolean {
    return typeof this.name !== 'string'
      || this.name === null
      || this.name.length === 0;
  }

  /**
   * Get the available sub types for the current type
   *
   * @return {ILabelledValue[]}
   */
  public getAvailableSubTypes(): ILabelledValue[] {
    if (this.type === FieldType.String) {
      return FieldSubType.string();
    }
    if (this.type === FieldType.Number) {
      return FieldSubType.number();
    }
    if (this.type === FieldType.Boolean) {
      return FieldSubType.boolean();
    }
    if (this.type === FieldType.DateTime) {
      return FieldSubType.datetime();
    }
    if (this.type === FieldType.Entity) {
      return FieldSubType.entity();
    }
    return [];
  }
}
