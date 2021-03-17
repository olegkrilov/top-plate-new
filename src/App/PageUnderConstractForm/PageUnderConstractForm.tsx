import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {PROFILE, SERVICES} from '../../Common/Constants.enum';
import TP_Modal from '../../Components/Modal/TP-Modal.component';
import {SharedService} from '../../Services/Shared.service';
import {AWAIT, CHECK_CLICK_TARGET, DIG_OUT} from '../../Core/Core.helpers';
import './PageUnderConstractForm.scss';

const 
    ROOT = `tp-construct-page-modal`,
    FORM = `${ROOT}-form`;
    

@inject(SERVICES.USER_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class PageUnderConstractForm extends AbstractComponent{

    private root: any = React.createRef();


    render () {
        const
        {services, props} = this,
        sharedService: SharedService = services[SERVICES.SHARED_SERVICE];

        return <TP_Modal model={sharedService.pageUnderConstractModal}>
                    <div className={`container padding-top-200`}>
                        <div className={`row register-form-height`}>
                            <div className={`col-12 col-lg-3 col-xl-3`}></div>
                            <div  className={`col-12 col-lg-6 col-xl-6`}>
                                <div ref={this.root} className={`${FORM} padding-left-30 padding-right-30 padding-top-30`}>
                                    <span>This page is under construction, sorry :-(</span>
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
          sharedService.pageUnderConstractModal.toggleValue(CHECK_CLICK_TARGET(this.root.current, event.target))
        };
        
        this.registerSubscriptions(
            sharedService.pageUnderConstractModal.subscribe(
              state => state? doc.addEventListener('click', onClickOutside): 
                              doc.removeEventListener('click', onClickOutside)    
            )
          );
    }
}