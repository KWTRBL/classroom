import React from 'react';
import login from './login.jpg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
  return (
    <div >
      <header >
          <div class="title">
            <h1 id="classroom">Classroom</h1>
            <h1 id="manage">Management</h1>
          </div>
          <div class="formLogin">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="light" type="submit" className="btlogin" >
                    Login
                </Button>
            </Form>
        </div>
        <img src={login} className="login_logo" alt="login" />
      </header>
    </div>
  );
}

export default Login;
