import React from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavEx'
import './statusEx.css';

function statusEx() {
  return (
    <div >
        <Nav/>
        <h2 class="state">สถานะการใช้ห้อง</h2>
        <div class="filterCr">
            <h3 class="build">ตึก </h3>
            <Form className="formbuild">
                <Form.Control as="select">
                    <option>E12</option>
                    <option>Me</option>
                    <option>Hm</option>
                </Form.Control>
            </Form>
            <h3 class="floor">ชั้น</h3>
            <Form className="formfloor">
                <Form.Control as="select">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                </Form.Control>
            </Form>
        </div>
        <div class="tableStatus">
            <table>
                <tr>
                    <th id="roomCr">ห้อง</th>
                    <th id="stateCr">สถานะ</th>
                </tr>
                <tr>
                    <td>401</td>
                    <td >
                        <Form className="formCr">
                            <Form.Control as="select">
                                <option>ใช้ได้</option>
                                <option>ใช้ไม่ได้</option>
                            </Form.Control>
                        </Form>
                    </td>   
                </tr>
                <tr>
                    <td>402</td>
                    <td>
                        <Form className="formCr" >
                            <Form.Control as="select">
                                <option>ใช้ได้</option>
                                <option>ใช้ไม่ได้</option>
                            </Form.Control>
                        </Form>
                    </td>  
                </tr>
                <tr>
                    <td>403</td>
                    <td>
                        <Form className="formCr">
                            <Form.Control as="select">
                                <option>ใช้ได้</option>
                                <option>ใช้ไม่ได้</option>
                            </Form.Control>
                        </Form>
                    </td>
                </tr>
                <tr>
                    <td>404</td>
                    <td>
                        <Form className="formCr">
                            <Form.Control as="select" >
                                <option>ใช้ได้</option>
                                <option>ใช้ไม่ได้</option>
                            </Form.Control>
                        </Form>
                    </td>
                </tr>
            </table>  
        </div>
    </div>
  );
}

export default statusEx;
