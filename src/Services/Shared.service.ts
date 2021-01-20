import {BooleanObservable} from '../Core/Observables/Boolean.observables';
import TP_DialogueModel from '../Components/Dialogue/TP-Dialogue.model';

export class SharedService {

  public readonly loginFormModal: BooleanObservable = new BooleanObservable();

  public readonly appDialogue: TP_DialogueModel = new TP_DialogueModel();

}

export default new SharedService();

