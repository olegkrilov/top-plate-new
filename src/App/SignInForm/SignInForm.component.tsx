import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {PROFILE, SERVICES} from '../../Common/Constants.enum';
import TP_Modal from '../../Components/Modal/TP-Modal.component';
import TP_Form from '../../Components/Forms/TP-Form.component';
import TP_FormModel from '../../Components/Forms/TP-Form.model';
import TP_StringInputModel from '../../Components/Forms/StringInput/TP-StringInput.model';
import {EVENTS, STATES, SYMBOLS} from '../../Core/Core.constants';
import {SharedService} from '../../Services/Shared.service';
import TP_StringInput from '../../Components/Forms/StringInput/TP-StringInput.component';
import {UserService} from '../../Services/User.service';
import {AbstractObserver} from '../../Core/Abstract/Abstract.observer';
import TP_ButtonModel from '../../Components/Forms/Button/TP_Button.model';
import TP_Button from '../../Components/Forms/Button/TP_Button.component';
import {MdLockOutline, MdMailOutline} from 'react-icons/all';
import {AbstractPipe} from '../../Core/Abstract/Abstract.pipe';
import {BooleanObservable} from '../../Core/Observables/Boolean.observables';
import TP_Loader from '../../Components/Loader/TP-Loader.component';
import {AWAIT, CHECK_CLICK_TARGET, DIG_OUT} from '../../Core/Core.helpers';
import {API_PROPS} from '../../Common/API.enum';
import './SignInForm.component.scss'
import {IS_VALID_EMAIL,IS_REQUIRED, IS_VALID_PASSWORD} from "../../Common/Helpers/Validators";

const
  ROOT = `tp-sign-in-modal`,
  FORM = `${ROOT}-form`,
  TEXT = `${FORM}-text`;

@inject(SERVICES.USER_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class SignInForm extends AbstractComponent {

  private root: any = React.createRef();

  private readonly loginForm: TP_FormModel = new TP_FormModel().addFields(
    [
      new TP_StringInputModel(
        PROFILE.EMAIL, {
        validators: [IS_REQUIRED(), IS_VALID_EMAIL()]     
      }),
      new TP_StringInputModel(
        PROFILE.PASSWORD, {
        validators: [IS_REQUIRED(), IS_VALID_PASSWORD()],
      })
    ]
  );

  private readonly isLoading: BooleanObservable = new BooleanObservable();

  private readonly submitButton: TP_ButtonModel = new TP_ButtonModel();

  render () {
    const
      {services, loginForm, submitButton, props, isLoading} = this,
      sharedService: SharedService = services[SERVICES.SHARED_SERVICE],
      userService: UserService = this.services[SERVICES.USER_SERVICE];

    return <TP_Modal model={sharedService.loginFormModal}
                     className={`${ROOT} ${props.className || SYMBOLS.EMPTY_STRING}`}>
      <div className={`container`}>
        <div className={`row sign-in-form-height`}>
          <div className={`col-12 col-lg-3 col-xl-3`}></div>
          <div ref={this.root} className={`col-12 col-lg-6 col-xl-6 `}>
              <TP_Form model={loginForm} className={`${FORM} padding-left-30 padding-right-30 padding-top-30`}>
                <div className={`text-center`}>
                  <h3 className={`${TEXT} mb-4`}>SIGN IN</h3>
                </div>
                <h5 className={`${TEXT}`}>Email</h5>
                <TP_StringInput className={`mb-4`} model={loginForm.getField(PROFILE.EMAIL)}/>
                <h5 className={`${TEXT}`}>Password</h5>
                <TP_StringInput className={`mb-4`}
                                model={loginForm.getField(PROFILE.PASSWORD)}
                                                    type={PROFILE.PASSWORD}/>
                <div className={`text-center`}>
                  <TP_Button className={`green-btn three-quarters-width mb-4`} model={submitButton}>
                    <b>SIGN IN</b>
                    {isLoading.value && <TP_Loader className={`d-ib colorWhite sizeSmall`} />}
                  </TP_Button>
                </div>
                <div className={`text-center`}>
                  <TP_Button className={`black-btn half-width mb-4`} 
                  onClick={() =>sharedService.loginFormModal.toggleValue() && sharedService.registerFormModal.toggleValue()}>
                    <b>dont have an account?</b>
                    {isLoading.value && <TP_Loader className={`d-ib colorWhite sizeSmall`} />}
                  </TP_Button>
                </div>
              </TP_Form>
          </div>
          <div className={`col-12 col-lg-3 col-xl-3`}></div>
        </div>
      </div>
    </TP_Modal>;
  }

  componentDidMount() {
    const
      {services, loginForm, submitButton, isLoading} = this,
      sharedService: SharedService = services[SERVICES.SHARED_SERVICE],
      userService: UserService = services[SERVICES.USER_SERVICE];

    const 
      doc = document;
      
    const 
      onClickOutside = (event: Event)=> {
        sharedService.loginFormModal.toggleValue(CHECK_CLICK_TARGET(this.root.current, event.target))
      };

    const
      loginPipe = new AbstractPipe([
        () => isLoading.setValue(true),
        () => AWAIT(2000),
        () => userService.login(loginForm.current),
      ], false)
        .catch((err) => sharedService.appDialogue
          .setView(DIG_OUT(err, API_PROPS.STATUS_TEXT), DIG_OUT(err, API_PROPS.STATUS))
          .show()
        )
        .finally(() => isLoading.setValue(false));

    this.registerSubscriptions(
      sharedService.loginFormModal.subscribe(
        state => state && loginForm.reset()
      ),
      sharedService.loginFormModal.subscribe(
        state => state? doc.addEventListener('click', onClickOutside): 
                        doc.removeEventListener('click', onClickOutside)    
      ),
      submitButton[EVENTS.ON_CLICK].subscribe(
        e => loginPipe.run()
      ),
      isLoading.subscribe(
        state => [loginForm, submitButton].forEach(c => c.toggleDisabled(state))
      ),
      new AbstractObserver(() => userService.isAuthorized).subscribe(
        state => state && sharedService.loginFormModal.toggleValue(false)
      )
    );
  }
}

