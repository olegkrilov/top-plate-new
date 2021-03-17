import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {PROFILE, SERVICES, PLATE} from '../../Common/Constants.enum';
import TP_Modal from '../../Components/Modal/TP-Modal.component';
import {SharedService} from '../../Services/Shared.service';
import {AWAIT, CHECK_CLICK_TARGET, DIG_OUT} from '../../Core/Core.helpers';
import {TP_FileInput} from "../../Components/Forms/FileInput/TP-FileInput.component";
import {TP_FileInputModel} from "../../Components/Forms/FileInput/TP-FileInput.model"
import TP_Form from '../../Components/Forms/TP-Form.component';
import TP_FormModel from '../../Components/Forms/TP-Form.model';
import TP_StringInputModel from '../../Components/Forms/StringInput/TP-StringInput.model';
import TP_StringInput from "../../Components/Forms/StringInput/TP-StringInput.component"
import {IS_VALID_EMAIL,IS_REQUIRED, IS_VALID_PASSWORD,} from "../../Common/Helpers/Validators";
import './AddVideoForm.scss';

const 
    ROOT = `tp-add-video-modal`,
    FORM = `${ROOT}-form`;
    

@inject(SERVICES.USER_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class AddPlateForm extends AbstractComponent{

    private root: any = React.createRef();

    private readonly addPlateForm: TP_FormModel = new TP_FormModel().addFields(
        [ 
         
            new TP_StringInputModel(
              PLATE.INGREDIENT,{
              validators: [IS_REQUIRED()]       
            }),
            new TP_StringInputModel(
              PLATE.DESCRIPTION,{
              validators: [IS_REQUIRED()]    
            }),
            new TP_FileInputModel(
              PLATE.FILE_INPUT,{
                placeholder: 'The file should be ',
                validators: {
                isRequired: IS_REQUIRED(),
                },  
            })         
        ]
        );


    render () {
        const
        {services, props, addPlateForm} = this,
        sharedService: SharedService = services[SERVICES.SHARED_SERVICE];

        return <TP_Modal model={sharedService.addVideoFormModal}>
                    <div className={`container`}>
                        <div className={`row register-form-height`}>
                            <div className={`col-12 col-lg-3 col-xl-3`}></div>
                            <div  className={`col-12 col-lg-6 col-xl-6`}>
                                <div ref={this.root} className={`${FORM} padding-left-30 padding-right-30 padding-top-30`}>
                                    <TP_Form model={addPlateForm}>
                                    <TP_StringInput className={`mb-4`} 
                                    model={addPlateForm.getField(PLATE.INGREDIENT)}/>
                                    <TP_StringInput className={`mb-4`} 
                                    model={addPlateForm.getField(PLATE.DESCRIPTION)}/>
                                    <TP_FileInput model={addPlateForm.getField(PLATE.FILE_INPUT)}/>
                                    </TP_Form>                                
                                </div>
                            </div>
                            <div className={`col-12 col-lg-3 col-xl-3`}></div>
                        </div>
                    </div>
                </TP_Modal>     
    }
    componentDidMount() {

        const
        {services} = this,
        sharedService: SharedService = services[SERVICES.SHARED_SERVICE];
        
        const 
        doc = document;

        const 
        onClickOutside = (event: Event)=> {
          sharedService.addVideoFormModal.toggleValue(CHECK_CLICK_TARGET(this.root.current, event.target))
        };
        
        this.registerSubscriptions(
            sharedService.addVideoFormModal.subscribe(
              state => state? doc.addEventListener('click', onClickOutside): 
                              doc.removeEventListener('click', onClickOutside)    
            )
          );
    }
}