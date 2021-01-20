export enum TYPES {
  FUNCTION = 'function',
  STRING = 'string',
  OBJECT = 'object'
}

export enum SYMBOLS {
  EMPTY_STRING = '',
  TILDA = '~'
}

export enum ASYNC {
  THEN = 'then',
  CATCH = 'catch',
  FINALLY = 'finally'
}

export enum COMMON {
  DB_ID = '_id',
  ID = 'id',
  ERROR = 'error',
  VALUE = 'value',
  NAME  = 'name',
  LABEL = 'label',
  DATA = 'data',
  PARAMS = 'params',
  MODEL = 'model',
  TITLE = 'title',
  TYPE = 'type',
  USER = 'user',
  TIMESTAMP = 'timestamp',
  CLASS_NAME = 'className',
  ORIGIN = 'origin',
  TARGET = 'target',
  CURRENT = 'current',
  VIEW = 'view'
}

export enum COLLECTION_CONFIG_PROPS {
  PARENT_ITEM = 'parentItem',
  TRACK_BY = 'trackBy',
  ALLOW_MULTISELECT = 'allowMultiselect'
}

export enum COLLECTION_PROPS {
  ITEM_ID = '__itemId',
  PARENT_COLLECTION = '__parentCollection',
  IS_SELECTED = '__isSelected',
  SOURCE = '__source'
}

export enum COLLECTION_METHODS {
  TOGGLE = '__toggle',
  SELECT = '__select',
  DESELECT = '__deselect',
  ADD_CLASS = '__addClass',
  REMOVE_CLASS = '__removeClass'
}

export enum PIPE_STATES {
  IS_WAITING = '__isWaiting',
  IS_RUNNING = '__isRunning',
  HAS_ERROR = '__hasError',
  HAS_RESULT = '__hasResult'
}

export enum EVENTS {
  ON_CLICK = 'onClick',
  ON_READY = 'onReady',
  ON_CHANGE = 'onChange',
  ON_FOCUS = 'onFocus',
  ON_BLUR = 'onBlur',
  ON_ERROR = 'onError',
  ON_SUBMIT = 'onSubmit',
  ON_SCROLL = 'onScroll'
}

export enum STATES {
  IS_OPENED = 'isOpened',
  IS_CLOSED = 'isClosed',
  IS_COLLAPSED = 'isCollapsed',
  IS_READY = 'isReady',
  IS_ACTIVE = 'isActive',
  IS_ENABLED = 'isEnabled',
  IS_DISABLED = 'isDisabled',
  IS_SELECTED = 'isSelected',
  IS_FOCUSED = 'isFocused',
  IS_VISIBLE = 'isVisible',
  IS_LOADING = 'isLoading',
  IS_EMPTY = 'isEmpty',
  IS_REQUIRED = 'isRequired',
  IS_REVERSED = 'isReversed',
  IS_SORTABLE = 'isSortable',
  IS_SCROLLABLE = 'isScrollable',
  IS_STARTED = 'isStarted',
  IS_FINISHED = 'isFinished',
  IS_VALID = 'isValid',
  IS_ANIMATED = 'isAnimated',
  IS_SCALED = 'isScaled',
  HAS_ERROR = 'hasError'
}

export enum KEY_CODES {
  TAB_KEY = 9,
  ENTER_KEY = 13
}
