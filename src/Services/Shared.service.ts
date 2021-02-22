import {BooleanObservable} from '../Core/Observables/Boolean.observables';
import TP_DialogueModel from '../Components/Dialogue/TP-Dialogue.model';
import { AS_ARRAY , IS_UNDEFINED} from '../Core/Core.helpers';


export class SharedService {

  public readonly pageUnderConstractModal: BooleanObservable = new BooleanObservable();

  public readonly loginFormModal: BooleanObservable = new BooleanObservable();

  public readonly registerFormModal: BooleanObservable = new BooleanObservable();

  public readonly charityFormModal: BooleanObservable = new BooleanObservable();

  public readonly appDialogue: TP_DialogueModel = new TP_DialogueModel();

  public loadImages = (src): Promise<any> => new Promise((resolve, reject) => {
    const
      _src = AS_ARRAY(src),
      _singleSource = _src.length === 1,
      _loadedImages: HTMLImageElement[] = [],
      _loadImage = (i: number = 0) => {
        if (IS_UNDEFINED(_src[i])) resolve(_singleSource ? _loadedImages[0] : _loadedImages);
        else {
          let image = new Image();
          image.src = _src[i];
          image.onload = () => {
            _loadedImages.push(image);
            _loadImage(i + 1);
          };
          image.onerror = err => {
            console.log(`Can not load ${_src[i]}`);
            _loadImage(i + 1);
          }
        }
      };
    _loadImage();
  });

  
}
export default new SharedService();

