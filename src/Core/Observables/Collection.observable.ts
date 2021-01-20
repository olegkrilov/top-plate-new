import {COLLECTION_CONFIG_PROPS, COLLECTION_METHODS, COLLECTION_PROPS, COMMON, SYMBOLS} from '../Core.constants';
import {AS_ARRAY, AS_FUNCTION, DIG_OUT, IS_NOT_UNDEFINED, IS_NULL, IS_STRING, IS_UNDEFINED} from '../Core.helpers';
import {computed} from 'mobx';
import {AbstractSubscription} from '../Abstract/Abstract.subscription';
import {StringObservable} from './String.observable';
import {StructureObservable} from './Structure.observable';

export interface ICollectionObservableConfig {
  [COLLECTION_CONFIG_PROPS.PARENT_ITEM]?: any,
  [COLLECTION_CONFIG_PROPS.TRACK_BY]?: string,
  [COLLECTION_CONFIG_PROPS.ALLOW_MULTISELECT]?: boolean
}

export class CollectionObservable {
  
  private static getDefaultConfig = (): ICollectionObservableConfig => ({
    [COLLECTION_CONFIG_PROPS.TRACK_BY]: COMMON.ID,
    [COLLECTION_CONFIG_PROPS.ALLOW_MULTISELECT]: false
  });
  
  private static _index = 0;
  
  private _index = 0;
  
  private readonly _uid: string;
  
  private readonly _config: ICollectionObservableConfig;
  
  private readonly _items: StructureObservable = new StructureObservable();
  
  private readonly _selection: StructureObservable = new StructureObservable();
  
  private _getId = (d): string => IS_STRING(d) ? d : d[COLLECTION_PROPS.ITEM_ID];
  
  private _getItem = (d): any => IS_UNDEFINED(d) ? null : this._items.getKey(this._getId(d));
  
  private _create = (d, index): this => {
    const
      collection = this,
      uid = DIG_OUT(d, this._config[COLLECTION_CONFIG_PROPS.TRACK_BY]) || `${this._uid}#Item#${index}`;
    
    return new Proxy(d, {
      get(target: any, prop: PropertyKey | string): any {
        if (d.hasOwnProperty(prop)) return d[prop];
        else {
          switch (prop) {
            case COLLECTION_PROPS.PARENT_COLLECTION:
              return collection;
            case COLLECTION_PROPS.ITEM_ID:
              return uid;
            case COLLECTION_PROPS.IS_SELECTED:
              return collection.isSelected(uid);
            case COLLECTION_PROPS.SOURCE:
              return d;
            case COLLECTION_METHODS.SELECT:
              return () => collection._toggleItem(uid, true);
            case COLLECTION_METHODS.DESELECT:
              return () => collection._toggleItem(uid, false);
            case COLLECTION_METHODS.TOGGLE:
              return (state: boolean | null = null) => collection._toggleItem(uid, state);
            default:
              return d[prop];
          }
        }
      }
    });
  };
  
  private _selectItem = (d): this => {
    if (!d[COLLECTION_PROPS.IS_SELECTED]) {
      !this._config.allowMultiselect && this._selection.clear();
      this._selection.setKey(d[COLLECTION_PROPS.ITEM_ID], d);
    }
    
    return this;
  };
  
  private _deselectItem = (d): this => {
    d[COLLECTION_PROPS.IS_SELECTED] && this._selection.removeKey(d[COLLECTION_PROPS.ITEM_ID]);
    return this;
  };
  
  private _toggleItem = (d, state: boolean | null = null): this => {
    const
      item = this._getItem(d);
    
    return item ? ((
      IS_NULL(state)
        ? !item[COLLECTION_PROPS.IS_SELECTED]
        : !!state
    )
      ? this._selectItem(item)
      : this._deselectItem(item)) : this;
  };
  
  public addItems = (d): this => {
    this._items.setValue(AS_ARRAY(d).reduce(
      (newItems, dd) => {
        const
          item = this._create(dd, this._index++);
        
        return Object.assign(newItems, {[item[COLLECTION_PROPS.ITEM_ID]]: item});
      }, {})
    );
    
    return this;
  }
  
  public getItem = (d): any => this._getItem(d);
  
  public hasItem = (d): boolean => this._items.hasKey(this._getId(d));
  
  public deleteItems = (d): this => {
    const
      _items = this._items.value,
      _selection = this._selection.value;
    
    let
      _hasCollectionUpdates = false,
      _hasSelectionUpdates = false;
    
    AS_ARRAY(d).forEach(dd => {
      const
        item = this._getItem(dd);
      
      if (item) {
        const
          uid = item[COLLECTION_PROPS.ITEM_ID];
        
        _hasCollectionUpdates = _hasCollectionUpdates || this._items.hasKey(uid);
        _hasSelectionUpdates = _hasSelectionUpdates || this._selection.hasKey(uid);
        
        delete _items[uid];
        delete _selection[uid];
      }
    });
    
    _hasCollectionUpdates && this._items.setValue(_items);
    _hasSelectionUpdates && this._selection.setValue(_selection);
    
    return this;
  };
  
  public replaceItems = (d): this => {
    this._selection.clear();
    this._items.clear();
    
    return this.addItems(d);
  };
  
  public selectItem = (d): this => this._toggleItem(d, true);
  
  public selectFirst = (d): this => this._toggleItem(this.items[0], true);
  
  public selectLast = (d): this => this._toggleItem(this.items[-1], true);
  
  public deselectItem = (d): this => this._toggleItem(d, false);
  
  public toggleItem = (d, state: boolean | null = null): this => this._toggleItem(d, state);
  
  public isSelected = (d) => this._selection.hasKey(this._getId(d));
  
  public subscribe = (fn: any, observeSelection: boolean = true, skip: boolean = false): AbstractSubscription =>
    (observeSelection ? this._selection : this._items).subscribe(
      () => AS_FUNCTION(fn, observeSelection ? this.selection : this.items),
      skip
    );
  
  @computed
  public get items (): any[] {
    const
      _items = this._items.value;
    
    return Object.keys(_items).map(key => _items[key]);
  }
  
  @computed
  public get size (): number {
    return this.items.length;
  }
  
  @computed
  public get selection (): any[] | null | any {
    if (this._selection.isEmpty) return null;
    else {
      const
        _selection = this._selection.value,
        _selectedItems = Object.keys(_selection).map(key => _selection[key]);
      
      return _selectedItems.length ?
        (this._config.allowMultiselect ? _selectedItems : _selectedItems[0]) : null;
    }
  }
  
  constructor (customConfig: ICollectionObservableConfig = {}) {
    this._uid = `Collection#${CollectionObservable._index++}`;
    this._config = Object.assign(CollectionObservable.getDefaultConfig(), customConfig);
  }
  
}

