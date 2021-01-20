import React, {lazy, Suspense} from 'react';
import {ROUTES, ROUTING_PROPS} from '../Common/Constants.enum';
import {COMMON, SYMBOLS} from '../Core/Core.constants';
import TP_Loader from '../Components/Loader/TP-Loader.component';

const
  RedirectRoute = lazy(() => import('./RedirectRoute/Redirect.route')),
  HomeRoute = lazy(() => import('./HomeRoute/Home.route'));
  
const
  RouteLoader = <TP_Loader className={'full-height-without-header'}/>;
  

export default [
  {
    [COMMON.NAME]: ROUTES.DEFAULT,
    [ROUTING_PROPS.PATH]: SYMBOLS.EMPTY_STRING,
    [ROUTING_PROPS.COMPONENT]:
      <Suspense fallback={RouteLoader}>
        <RedirectRoute redirectTo={ROUTES.HOME} />
      </Suspense>,
    [ROUTING_PROPS.ROUTE]: null
  },
  {
    [COMMON.NAME]: ROUTES.HOME,
    [ROUTING_PROPS.PATH]: ROUTES.HOME,
    [ROUTING_PROPS.COMPONENT]:
      <Suspense fallback={RouteLoader}>
        <HomeRoute />
      </Suspense>,
    [ROUTING_PROPS.ROUTE]: null
  },
  {
    [COMMON.NAME]: [ROUTES.USERS],
    [ROUTING_PROPS.PATH]: `${ROUTES.USERS}/:userId?`,
    [ROUTING_PROPS.COMPONENT]: <div>Users</div>,
    [ROUTING_PROPS.ROUTE]: null
  },
  {
    [COMMON.NAME]: ROUTES.PLATES,
    [ROUTING_PROPS.PATH]: `${ROUTES.PLATES}/:plateId?`,
    [ROUTING_PROPS.COMPONENT]: <div>Plates</div>,
    [ROUTING_PROPS.ROUTE]: null
  }
];
