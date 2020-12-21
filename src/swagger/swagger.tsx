import React from "react";
import ReactDOM from "react-dom";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";


export class Swagger extends SwaggerUI{
    render(){
        return (
            <div>
               <SwaggerUI url= 'http://localhost:8080/swagger.json' />
            </div>
        );
    }
}
