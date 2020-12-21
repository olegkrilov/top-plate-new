import React from 'react';

import './App.css';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

function App() {
  return (
   <div>
     <SwaggerUI url="http://localhost:8081/swagger.json" withCredentials="true" />
   </div>
  );
}

export default App;
