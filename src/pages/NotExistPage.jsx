import React from 'react';
import '../styles/error.css';
import {Button} from "react-bootstrap";

export default function NotExist () {
  return (
    <div className='error-page '>
      <h1>404 - Тази страница не съществува!</h1>
        <Button className='register-button' href='/'>Начална страница</Button>
    </div>
  );
};