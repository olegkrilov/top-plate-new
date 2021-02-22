import React from 'react';
import {AbstractComponent} from '../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {PROFILE, SERVICES} from '../Common/Constants.enum';
import {TP_BackgroundImage} from '../Components/TP_BackgroundImage/TP_BackgroundImage';
import TP_Button from '../Components/Forms/Button/TP_Button.component';
import {SharedService} from '../Services/Shared.service';
import './App.footer.scss';

const
  ROOT = `tp-footer`,
  LOGO = `${ROOT}-logo`;

const 
  FOOTER_LOGO = './Plates_Logo_valid.png'


@inject(SERVICES.ROUTING_SERVICE, SERVICES.USER_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export class AppFooter extends AbstractComponent {
    render() {

      const
        sharedService: SharedService = this.services[SERVICES.SHARED_SERVICE]
        

        return (
          <footer className={`${ROOT}`}>
            <div className={`container`}>
              <div className={`row`}>
                <div className={`col-12 col-lg-2 col-xl-2 `}>
                <div className={`${LOGO} padding-top-10`}>
                    <TP_BackgroundImage source={FOOTER_LOGO}/> 
                  </div>
                </div>
                <div className={`col-12 col-lg-6 col-xl-6 `}>
                  <div className={`padding-top-10`}>
                    <TP_Button onClick={() => sharedService.pageUnderConstractModal.toggleValue()} className={`transparent-btn`} >
                      <span>Privacy Term</span>
                    </TP_Button>
                    <TP_Button onClick={() => sharedService.pageUnderConstractModal.toggleValue()} className={`transparent-btn`} >
                      <span>Copyright</span>
                    </TP_Button>
                    <TP_Button onClick={() => sharedService.pageUnderConstractModal.toggleValue()} className={`transparent-btn`} >
                      <span>Rate Us</span>
                    </TP_Button>
                    <TP_Button onClick={() => sharedService.pageUnderConstractModal.toggleValue()} className={`transparent-btn`} >
                      <span>Contact Us</span>
                    </TP_Button>
                  </div>   
                </div>
                <div className={`col-12 col-lg-2 col-xl-2 `}>
                  <div className={`full-width pos-abs tp-footer-text-color padding-top-20`}>
                      <span>Ⓒ TopPlate.2021 </span>
                  </div>
                </div>
                <div className={`col-12 col-lg-2 col-xl-2 `}>
                </div>
              </div>
            </div>
          </footer>
        );
      }
}