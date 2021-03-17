import React from 'react';
import {inject, observer} from 'mobx-react';
import {MobxRouter} from 'mobx-router';
import {SERVICES} from '../Common/Constants.enum';
import {AbstractComponent} from '../Core/Abstract/Abstract.component';
import {STATES} from '../Core/Core.constants';
import './App.scss';
import {SharedService} from '../Services/Shared.service';
import SignInForm from './SignInForm/SignInForm.component';
import RegisterForm from './RegisterForm/RegisterForm.component';
import PageUnderConstractForm from './PageUnderConstractForm/PageUnderConstractForm';
import AddVideoForm from './AddVideoForm/AddVideoForm'
import CharityForm from './CharityForm/CharityForm.component'
import {UserService} from '../Services/User.service';
import TP_Dialogue from '../Components/Dialogue/TP-Dialogue.component';
import ErrorDialogueTpl from '../Components/Dialogue/Templates/ErrorDialogue.tpl';
import {AppHeader} from './App.header';
import {AppFooter} from './App.footer';

@inject(SERVICES.ROUTING_SERVICE, SERVICES.USER_SERVICE, SERVICES.SHARED_SERVICE)
@observer
class App extends AbstractComponent {

  componentDidMount() {
    const
      userService: UserService = this.services[SERVICES.USER_SERVICE];

    userService.fetch()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
  
  render () {
    const
      sharedService: SharedService = this.services[SERVICES.SHARED_SERVICE],
      userService: UserService = this.services[SERVICES.USER_SERVICE];

    const
      testGrowl = () => sharedService.appDialogue
        .setView('You are Fucked!!!')
        .show();

    return <div>
      <AppHeader/>
      <div className={`padding-top-100 padding-bottom-70`}>
        <MobxRouter store={this.props[SERVICES.ROUTING_SERVICE]} />
      </div>
      
      <SignInForm/>
      <RegisterForm/>
      <CharityForm/>
      <AddVideoForm/>
      <PageUnderConstractForm/>
      <TP_Dialogue model={sharedService.appDialogue} />
      <div className={`test-btn`}>
        {/* {!userService.isAuthorized && <button onClick={() => sharedService.loginFormModal.toggleValue()}>
          SIGN IN
        </button>}
        {userService.isAuthorized && <button onClick={() => userService.logout()}>
          SIGN OUT
        </button>}  */}
        {/* {!sharedService.appDialogue[STATES.IS_OPENED].value && <button onClick={() => testGrowl()}>
          SHOW GROWL
        </button>} */}
      </div>
      <AppFooter/>
    </div>;
  }
}

export default App
