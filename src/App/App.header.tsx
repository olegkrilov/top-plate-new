import React from 'react';
import {AbstractComponent} from '../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {ROUTES, SERVICES} from '../Common/Constants.enum';
import {RoutingService} from '../Services/Routing.service';
import {UserService} from '../Services/User.service';
import {TP_BackgroundImage} from '../Components/TP_BackgroundImage/TP_BackgroundImage';
import {SharedService} from '../Services/Shared.service';
import TP_Button from '../Components/Forms/Button/TP_Button.component';
import './App.header.scss';
import { FaBeer } from 'react-icons/fa';
import { AiOutlineHeart,AiOutlineLogin,AiOutlineLogout,AiOutlinePlusCircle } from "react-icons/ai";



const
  ROOT = `tp-header`,
  LOGO = `${ROOT}-logo`,
  NAV = `${ROOT}-nav`,
  BTN_BORDER = `tp-btn-border`,
  SMALL_BTN_BORDER = `${BTN_BORDER}-small`,
  BTN_BIG_GREEN = `tp-btn-big-green`,
  SEARCH_BAR = `tp-search-bar`,
  GREEN_BTN_ICON = `tp-green-btn-icon`,
  BTN_ICON_SMALL = `tp-btn-icon-small`,
  GREEN_BTN_TEXT = `tp-green-btn-text`,
  BTN_TEXT = `tp-btn-text`,
  SIGNUP = `tp-sign-up`;
  

const
  LOGO_FINAL='/TopPlate_Logo_Final.png'

@inject(SERVICES.ROUTING_SERVICE, SERVICES.USER_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export class AppHeader extends AbstractComponent {

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

    return <div className={`${ROOT} pos-rel header-height`}> 
      <div className={``}>
        <div className={`full-width row header-height`}>
          <div className={`col-12 col-lg-3 col-xl-3 header-height`}>       
              <div className={`${LOGO} logo-width size-cover`}>
                <TP_BackgroundImage source={LOGO_FINAL}/> 
              </div>
          </div>
          <div className={`col-12 col-lg-3 col-xl-3 header-height`}>
          <div className={`padding-top-20 `}>
            <TP_Button className={BTN_BIG_GREEN} onClick={() => sharedService.loginFormModal.toggleValue()}>
              <AiOutlinePlusCircle className={GREEN_BTN_ICON}/>
              <span className={GREEN_BTN_TEXT}>ADD VIDEO</span>
            </TP_Button>
          </div>  
          </div>       
          <div className={`col-12 col-lg-3 col-xl-3 header-height pos-rel hidden-lg-down`}>
            <div className={`pos-abs right-0 padding-top-30`}>         
              <TP_Button className={`transparent-btn mr-2`} >
                <FaBeer className={BTN_ICON_SMALL}/> 
                <span className={BTN_TEXT}> WEEKLY WINNER</span>
              </TP_Button>
              <TP_Button onClick={() => sharedService.charityFormModal.toggleValue()} className={`padding-left-25 transparent-btn`} >
                <AiOutlineHeart className={BTN_ICON_SMALL}/> 
                <span className={BTN_TEXT}>CHARITY</span>
              </TP_Button>
            </div>
          </div>
          <div className={`col-12 col-lg-3 col-xl-3 header-height pos-rel hidden-xl-up`}>
            <div className={`pos-abs right-0 padding-top-30`}>
              <TP_Button className={`transparent-btn mr-2`} >
                <FaBeer className={BTN_ICON_SMALL}/> 
              </TP_Button>
              <TP_Button onClick={() => sharedService.charityFormModal.toggleValue()} className={`transparent-btn`} >
                <AiOutlineHeart className={BTN_ICON_SMALL}/> 
              </TP_Button>
            </div>
          </div>
          <div className={`col-12 col-lg-3 col-xl-3 header-height`}> 
            <div className={`pos-abs right-0 pt-4`}>
              {!userService.isAuthorized && <TP_Button className={BTN_BORDER} 
              onClick={() => sharedService.loginFormModal.toggleValue()}>
                <span className={BTN_TEXT}>SIGN UP/LOGIN</span>    
              </TP_Button>}
              {userService.isAuthorized && <TP_Button className={BTN_BORDER}
              onClick={() => userService.logout()}>
                <span className={BTN_TEXT}>LOG OUT</span>
              </TP_Button>}
            </div>
          </div>
        </div> 
      </div>
    </div>
}
}
