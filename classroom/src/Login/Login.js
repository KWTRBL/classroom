import React from "react";
import login from "./login.jpg";
import { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import Cookies from "universal-cookie";
import axios from "axios";

export default class ManageZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:7777/login",
        {
          username: this.state.username,
          password: this.state.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        document.getElementById("edittext").innerHTML =
          "<div style='color:red'>" + res.data.message + "</div>";
        console.log(res.data)
        if (res.data.isLogin) {
          if (res.data.role == 1) {
            this.props.history.push("/buildingdata");

          }
          if (res.data.role == 2) {
            this.props.history.push("/facultydata");

          }
          if (res.data.role == 3) {
            this.props.history.push("/buildingdata");

          }
          // this.props.history.push("/buildingdata");
        }
      })
      .catch((err) => {
        /* not hit since no 401 */
      });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <header>
          <div class="title">
            <h2 id="classroom">Classroom</h2>
            <h2 id="manage">And Invigilator</h2>
            <h2 id="manage">Management</h2>
          </div>
          <div class="formLogin">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="username"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                />
                <Form.Text id="edittext" className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Button variant="light" type="submit" className="btlogin">
                Login
              </Button>
            </Form>
          </div>
          <img src={login} className="login_logo" alt="login" />
        </header>
      </div>
    );
  }
}

/*
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
*/
