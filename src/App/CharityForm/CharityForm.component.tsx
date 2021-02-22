import React from 'react';
import {AbstractComponent} from '../../Core/Abstract/Abstract.component';
import {inject, observer} from 'mobx-react';
import {PROFILE, SERVICES} from '../../Common/Constants.enum';
import TP_Modal from '../../Components/Modal/TP-Modal.component';
import {SharedService} from '../../Services/Shared.service';
import {AWAIT, CHECK_CLICK_TARGET, DIG_OUT} from '../../Core/Core.helpers';
import {TP_BackgroundImage} from '../../Components/TP_BackgroundImage/TP_BackgroundImage'
import './CharityForm.component.scss';

const 
    ROOT = `tp-charity-modal`,
    FORM = `${ROOT}-form`,
    PICTURE = `${ROOT}-picture`,
    MAIN_HEADER = `main-header`,
    SECONDARY_HEADER = `secondary-header`,
    TEXT = `text`;



const CHARITY_FORM_DATA = {
    header: 'Live United',
    text: 'Live united is leading the way the world understand, treats and defeats childhood cancer and other life-threatening',
    image: `./LU.png`
}


@inject(SERVICES.USER_SERVICE, SERVICES.SHARED_SERVICE)
@observer
export default class CharityForm extends AbstractComponent{

    private root: any = React.createRef();


    render () {
        const
        {services, props} = this,
        sharedService: SharedService = services[SERVICES.SHARED_SERVICE];

        return <TP_Modal model={sharedService.charityFormModal}>
                    <div className={`container`}>
                        <div className={`row`}>
                            <div className={`col-12 col-lg-2 col-xl-2`}></div>
                            <div  className={`col-12 col-lg-8 col-xl-8`}>
                                <div ref={this.root} className={`${FORM} padding-left-30 padding-right-30 padding-top-30`}>
                                    <p className={`${MAIN_HEADER}`}>TOP PLATE CHARITY</p>
                                    <p className={`${SECONDARY_HEADER} padding-bottom-30`}>{CHARITY_FORM_DATA.header}</p>
                                    <div  className={`${PICTURE}`}>
                                        <TP_BackgroundImage source={CHARITY_FORM_DATA.image}/>
                                    </div>   
                                    <div className={`${TEXT} container padding-top-50`}>
                                        <span>{CHARITY_FORM_DATA.text}</span>
                                    </div>         
                                </div>
                            </div>
                            <div className={`col-12 col-lg-2 col-xl-2`}></div>
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
          sharedService.charityFormModal.toggleValue(CHECK_CLICK_TARGET(this.root.current, event.target))
        };
        
        this.registerSubscriptions(
            sharedService.charityFormModal.subscribe(
              state => state? doc.addEventListener('click', onClickOutside): 
                              doc.removeEventListener('click', onClickOutside)    
            )
          );
    }
}