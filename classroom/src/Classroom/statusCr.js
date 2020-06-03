import React from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import './statusCr.css';

function statusCr() {
  return (
    <div >
        <Nav/>
        <h1 class="state">สถานะการใช้ห้อง</h1>
        <div class="filterCr">
            <h4 class="build">ตึก </h4>
            <Form className="formbuild">
                <Form.Control as="select" size="sm">
                    <option>อาคาร 12 ชั้น</option>
                    <option>ตึกเครื่องกล</option>
                    <option>ตึก HM</option>
                </Form.Control>
            </Form>
            <h4 class="floor">ชั้น</h4>
            <Form className="formfloor">
                <Form.Control as="select" size="sm">
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
            <table className="tablecss">
                <tr>
                    <th id="roomCr">ห้อง</th>
                    <th id="stateCr">สถานะ</th>
                </tr>
                <tr>
                    <td>401</td>
                    <td >
                        <Form className="formCr">
                            <Form.Control as="select" >
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

export default statusCr;
