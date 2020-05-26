import React from 'react';
import Button from 'react-bootstrap/Button';
import bgimg from './bg.jpg';

import 'bootstrap/dist/css/bootstrap.min.css';
import './SelectCrEx.css';

function SelectCrEx() {
  return (
    <div class = "body">
    <img src={bgimg} className="body" alt="login" />

      <header >
      <Button variant="light" className="btroom CR">จัดห้องเรียน</Button>
      <Button variant="light" className="btroom Ex">จัดห้องสอบ</Button>
      </header>
    </div>
  );
}

export default SelectCrEx;
