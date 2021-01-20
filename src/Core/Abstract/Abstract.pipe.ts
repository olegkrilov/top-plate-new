import {
  AS_ARRAY,
  AS_FUNCTION,
  AS_PROMISE,
  DIG_OUT, DO_NOTHING,
  IS_FUNCTION,
  IS_NOT_NULL,
  IS_NULL,
  IS_PROMISE
} from '../Core.helpers';
import {PIPE_STATES, COMMON, ASYNC} from '../Core.constants';
import {StructureObservable} from '../Observables/Structure.observable';
import {AbstractSubscription} from './Abstract.subscription';
import {StringObservable} from '../Observables/String.observable';

export class AbstractPipe {
  
  private readonly _tasks: Map<number, any>;
  
  private readonly _state: StringObservable = new StringObservable(PIPE_STATES.IS_WAITING);
  
  private readonly _result: StructureObservable = new StructureObservable({
    [COMMON.VALUE]: undefined
  });
  
  private _stack: Iterable<any> | null | any = null;
  
  private _subscriptions: AbstractSubscription[] = [];

  private _subscribe = (fn, event): this => {
    this._subscriptions.push(this.subscribe(fn, event));
    return this;
  };
  
  public run = () => {
    this._stack = this._tasks.values();
    this._state.setValue(PIPE_STATES.IS_RUNNING);
    
    const
      _cancelWithError = (err) => {
        this._stack = null;
        this._result.setValue({[COMMON.VALUE]: err});
        this._state.setValue(PIPE_STATES.HAS_ERROR);
      },
      
      _resolve = (val) => {
        this._stack = null;
        this._result.setValue({[COMMON.VALUE]: val});
        this._state.setValue(PIPE_STATES.HAS_RESULT);
      },
      
      _nextTask = (val: any = undefined) => {
        if (this._state.value !== PIPE_STATES.IS_RUNNING) return;
  
        if (DIG_OUT(val, COMMON.ERROR)) _cancelWithError(val);
        else {
          const
            {done, value: task} = this._stack.next();

          if (done) _resolve(val);
          else AS_PROMISE(IS_PROMISE(task)
            ? task
            : (IS_FUNCTION(task)
                ? AS_FUNCTION(task, val)
                : () => task
            )
          )
            .then(_val => _nextTask(_val))
            .catch(_err => _cancelWithError(_err))
        }
      };
    
    _nextTask();
    
    return this;
  };
  
  public stop = () => {
    this._stack = null;
    this._state.setValue(PIPE_STATES.IS_WAITING);
    return this;
  };

  public subscribe = (fn: any = DO_NOTHING, event: string = ASYNC.THEN) => this._state.subscribe(
    state => (
      (event === ASYNC.THEN && state === PIPE_STATES.HAS_RESULT) ||
      (event === ASYNC.CATCH && state === PIPE_STATES.HAS_ERROR) ||
      (event === ASYNC.FINALLY && [PIPE_STATES.HAS_ERROR, PIPE_STATES.HAS_RESULT].some(s => s === state))
    ) && AS_FUNCTION(fn, event === ASYNC.FINALLY ? undefined : DIG_OUT(this._result, COMMON.VALUE, COMMON.VALUE))
  );

  public unsubscribe = () => this._subscriptions.forEach((s: AbstractSubscription) => s.unsubscribe());

  public then = (fn: any = DO_NOTHING): this => this._subscribe(fn, ASYNC.THEN);
  
  public catch = (fn: any = DO_NOTHING): this => this._subscribe(fn, ASYNC.CATCH);

  public finally = (fn: any = DO_NOTHING): this => this._subscribe(fn, ASYNC.FINALLY);
  
  constructor (tasks: any, runImmediately: boolean = true) {
    this._tasks = new Map<number, any>(AS_ARRAY(tasks).map((d, i) => [i, d]));
    runImmediately && this.run();
  }
  
}

