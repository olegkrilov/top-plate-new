import {SwitchObservable} from "../Observables/SwitchObservable";
import {AbstractEventObserver} from "../Observers/AbstractEventObserver";

export class AbstractInput {

  public readonly isFocused: SwitchObservable = new SwitchObservable();

  public readonly isDisabled: SwitchObservable = new SwitchObservable();

  public readonly onChange: AbstractEventObserver = new AbstractEventObserver('change');

  public readonly onFocus: AbstractEventObserver = new AbstractEventObserver('focus');

  public readonly onBlur: AbstractEventObserver = new AbstractEventObserver('blur');

  public readonly onError: AbstractEventObserver = new AbstractEventObserver('error');

  public toggleFocused = (state: boolean | null = null): this => {
    this.isFocused.toggleValue(state);
    return this;
  };

  public toggleDisabled = (state: boolean | null = null): this => {
    this.isDisabled.toggleValue(state);
    return this;
  };

}
