import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {PROFILE, SERVICES} from '../../Common/Constants.enum';
import TP_Modal from '../../Components/Modal/TP-Modal.component';
import TP_Form from '../../Components/Forms/TP-Form.component';
import TP_FormModel from '../../Components/Forms/TP-Form.model';
import TP_StringInputModel from '../../Components/Forms/StringInput/TP-StringInput.model';
import {EVENTS, STATES, SYMBOLS, COMMON} from '../../Core/Core.constants';
import {SharedService} from '../../Services/Shared.service';
import TP_StringInput from '../../Components/Forms/StringInput/TP-StringInput.component';
import {UserService} from '../../Services/User.service';
import {AbstractObserver} from '../../Core/Abstract/Abstract.observer';
import TP_ButtonModel from '../../Components/Forms/Button/TP_Button.model';
import TP_Button from '../../Components/Forms/Button/TP_Button.component';
import {AbstractPipe} from '../../Core/Abstract/Abstract.pipe';
import {BooleanObservable} from '../../Core/Observables/Boolean.observables';
import TP_Loader from '../../Components/Loader/TP-Loader.component';
import {AWAIT, CHECK_CLICK_TARGET, DIG_OUT} from '../../Core/Core.helpers';
import {API_PROPS} from '../../Common/API.enum';
import {IS_VALID_EMAIL,IS_REQUIRED, IS_VALID_PASSWORD,} from "../../Common/Helpers/Validators";
import {computed} from 'mobx';
import './RegisterForm.component.scss'

const
  ROOT = `tp-register-modal`,
  FORM = `${ROOT}-form`,
  TEXT = `${FORM}-text`;

  const errTypes = {
    [PROFILE.FIRST_NAME]: 'First name required',
    [PROFILE.LAST_NAME]: 'Last name required',
    [PROFILE.USER]: 'Username name required',
    [PROFILE.EMAIL]: 'Not valid Email',
    [PROFILE.PASSWORD]: 'Password must be at least 8 symbols, contain 1 nuber and 1 uppercase',
    [PROFILE.CONFIRM_PASSWORD]: 'Not the same as password'
  }; 


@inject(SERVICES.USER_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class RegisterForm extends AbstractComponent{
    

    private root: any = React.createRef();

    private readonly registerform: TP_FormModel = new TP_FormModel().addFields(
    [ 
        // new TP_StringInputModel(PROFILE.FIRST_NAME).toggleState(STATES.IS_REQUIRED, true),
        // new TP_StringInputModel(PROFILE.LAST_NAME).toggleState(STATES.IS_REQUIRED, true),
        // new TP_StringInputModel(PROFILE.USER).toggleState(STATES.IS_REQUIRED, true),
        new TP_StringInputModel(
          PROFILE.FIRST_NAME,{
          validators: [IS_REQUIRED()]       
        }),
        new TP_StringInputModel(
          PROFILE.LAST_NAME,{
          validators: [IS_REQUIRED()]    
        }),
        new TP_StringInputModel(
          PROFILE.USER, {
          validators: [IS_REQUIRED()]        
        },),
        new TP_StringInputModel(
          PROFILE.EMAIL, {
          validators: [IS_REQUIRED(), IS_VALID_EMAIL()]     
        }),
        new TP_StringInputModel(
          PROFILE.PASSWORD, {
          validators: [IS_REQUIRED(), IS_VALID_PASSWORD()]
        }),
        new TP_StringInputModel(
          PROFILE.CONFIRM_PASSWORD, {
          validators: [IS_REQUIRED(), IS_VALID_PASSWORD(), 
            (currentPassword) => 
          this.registerform.getField(PROFILE.PASSWORD).current === currentPassword]
        })
        // new TP_StringInputModel(PROFILE.PASSWORD).toggleState(STATES.IS_REQUIRED, true)
    ]
    );
    @computed
      public get isValid () {
      return this.registerform.fields.items.every(
      (d: TP_StringInputModel) => d.isValid);
    }

    private readonly isLoading: BooleanObservable = new BooleanObservable();

    private readonly submitButton: TP_ButtonModel = new TP_ButtonModel();

    

    render () {
        const
        {services,registerform,submitButton,isLoading, props} = this,
        sharedService: SharedService = services[SERVICES.SHARED_SERVICE];

        return <TP_Modal model={sharedService.registerFormModal}
                className={`${ROOT} ${props.className || SYMBOLS.EMPTY_STRING}`}>
                    <div className={`container`}>
        <div className={`row register-form-height`}>
          <div className={`col-12 col-lg-3 col-xl-3`}></div>
          <div ref={this.root} className={` col-12 col-lg-6 col-xl-6 `}>
              <TP_Form model={registerform} className={`${FORM} padding-left-30 padding-right-30 padding-top-30`}>
                <div className={`text-center`}>
                  <h3 className={`${TEXT} mb-4`}>CREATE ACCOUNT</h3>
                </div>
                <h5 className={`${TEXT}`}>First Name</h5>
                <TP_StringInput className={`mb-4`} 
                model={registerform.getField(PROFILE.FIRST_NAME)}/>
                <h5 className={`${TEXT}`}>Last Name</h5>
                <TP_StringInput className={`mb-4`} 
                model={registerform.getField(PROFILE.LAST_NAME)}/>
                <h5 className={`${TEXT}`}>Username</h5>
                <TP_StringInput className={`mb-4`} 
                model={registerform.getField(PROFILE.USER)} />
                <h5 className={`${TEXT}`}>Email</h5>
                <TP_StringInput className={`mb-4`} model={registerform.getField(PROFILE.EMAIL)}/>
                <h5 className={`${TEXT}`}>Password</h5>
                <TP_StringInput className={`mb-4`}
                                model={registerform.getField(PROFILE.PASSWORD)}
                                type={PROFILE.PASSWORD}/>
                <h5 className={`${TEXT}`}>Confirm Password</h5>
                <TP_StringInput className={`mb-4`}
                                model={registerform.getField(PROFILE.CONFIRM_PASSWORD)}
                                type={PROFILE.PASSWORD}/>
                <div className={`text-center`}>
                  <TP_Button className={`green-btn three-quarters-width mb-4`} model={submitButton}>
                    <b>Register</b>
                    {isLoading.value && <TP_Loader className={`d-ib colorWhite sizeSmall`} />}
                  </TP_Button>
                </div> 
              </TP_Form>
          </div>
          <div className={`col-12 col-lg-3 col-xl-3`}></div>
        </div>
      </div>
        </TP_Modal>     
    }
    componentDidMount() {
      const
        {services, registerform, submitButton, isLoading} = this,
        sharedService: SharedService = services[SERVICES.SHARED_SERVICE],
        userService: UserService = services[SERVICES.USER_SERVICE];

      const 
        doc = document;
      
      const 
        onClickOutside = (event: Event)=> {
          sharedService.registerFormModal.toggleValue(CHECK_CLICK_TARGET(this.root.current, event.target))
        };
  
      const
        registerPipe = new AbstractPipe([
          () => isLoading.setValue(true),
          () => AWAIT(2000),
          () => userService.register(registerform.current),
        ], false)
          .catch((err) => sharedService.appDialogue
            .setView(DIG_OUT(err, API_PROPS.STATUS_TEXT), DIG_OUT(err, API_PROPS.STATUS))
            .show()
          )
          .finally(() => isLoading.setValue(false));
  
      this.registerSubscriptions(
        sharedService.registerFormModal.subscribe(
          state => state && registerform.reset()
        ),
        sharedService.registerFormModal.subscribe(
          state => state? doc.addEventListener('click', onClickOutside): 
                          doc.removeEventListener('click', onClickOutside)    
        ),
        
        submitButton[EVENTS.ON_CLICK].subscribe(
          e => {
            //this.registerform.fields.items.forEach((d: TP_StringInputModel) => console.log(d.isValid))
           if(this.isValid === true){
             registerPipe.run();
           }
           else{
            const errList: string[] = this.registerform.fields.items.reduce((agg, d: TP_StringInputModel) => {
              !d.isValid && agg.push(errTypes[d.name])
              return agg;
            }, []); 
            errList.length && sharedService.appDialogue
            .setView(
               <div>{errList.map((err, i) =><p key={i}>{err}</p>)}</div>,
              "402"
              )       
            .show();
            console.log(errList)
           }  
          }
        ),
        isLoading.subscribe(
          state => [registerform, submitButton].forEach(c => c.toggleDisabled(state))
        ),
        new AbstractObserver(() => userService.isAuthorized).subscribe(
          state => state && sharedService.registerFormModal.toggleValue(false)
        ), 
      );
    }
}
