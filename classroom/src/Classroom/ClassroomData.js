import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import Foot from '../Navbar/FooterCr'
import axios from 'axios';
import { Component } from 'react';
import { json } from 'body-parser';
import './ClassroomData.css';

export default class ClassroomData extends Component {
    constructor(props) {
      super(props);
      this.state = {
          name: [],

      }
  }
  

  
  componentWillMount() {
        axios.get('http://localhost:7777/classroom')
        .then(res => {
          this.setState({
            name: res.data,
          })
         
        })
        .catch(function (error) {
          console.log(error);
        })
        
  
    }

    render() {
        return (
            <div >
                <Nav/>
                <h1 class="state">ข้อมูลห้องเรียน</h1>
                <div id="detail">
                <h4 className="buildfil1">อาคารเรียน</h4>
                <h4 className="buildfil2">ชั้น</h4>
                <div className="buildfildetail1">
                    <select>
                        <option value="0">อาคาร 12 ชั้น</option>
                        <option value="1">ตึกเครื่องกล</option>
                        <option value="2">อาคารเฉลิมพระเกียรติ7ชั้น</option>
                    </select>
                </div>
                <div className="buildfildetail2">
                    <select>
                        <option value="0">1</option>
                        <option value="1">2</option>
                        <option value="2">3</option>
                    </select>
                </div>
                    <table className="Crtable">
                        <thead>
                            <tr className="Buildtable">
                            <th>รหัสอาคาร</th>
                            <th>อาคารเรียน</th>
                            <th>รหัสห้อง</th>
                            <th>จำนวนที่นั่ง</th>
                            <th>สถานะ</th>
                            <th>แก้ไขข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.name.map(data => 
                                <tr>
                                <td>{data.building_no}</td>
                                <td>{data.building_no}</td>
                                <td>{data.room_no}</td>
                                <td>{data.seat_num}</td>
                                <td> 
                                    <Form>
                                        <Form.Check 
                                            type="switch"
                                            id="custom-switch2"
                                            label=""
                                            defaultChecked
                                        />
                                    </Form>
                                </td>
                                <td>
                                    <Button variant="light" className="editdata"> 
                                        <img src={editbt} className="editicon" alt="edit" />
                                    </Button>
                                    <Button variant="light" className="deletedata">
                                        <img src={deletebt} className="deleteicon" alt="delete" />
                                    </Button>
                                </td>
                                </tr>
                                )
                        }
                        </tbody>
                    </table>
                    <Button variant="light" className="adddata">
                        <img src={addbt} className="addicon" alt="add" />
                    </Button>
                    <Foot/>
                </div>
            </div>
        );
    }
  
}


/*function ClassroomData() {
  return (
    <div >
        <Nav/>
        <h1 class="state">ข้อมูลห้องเรียน</h1>
        <div id="detail">
            <h4 className="buildfil1">อาคารเรียน</h4>
            <h4 className="buildfil2">ชั้น</h4>
            <div className="buildfildetail1">
                <select>
                    <option value="0">อาคาร 12 ชั้น</option>
                    <option value="1">ตึกเครื่องกล</option>
                    <option value="2">อาคารเฉลิมพระเกียรติ7ชั้น</option>
                </select>
            </div>
            <div className="buildfildetail2">
                <select>
                    <option value="0">1</option>
                    <option value="1">2</option>
                    <option value="2">3</option>
                </select>
            </div>
            
            <table className="Crtable">
                <thead>
                    <tr className="Classroomtable">
                        <th>รหัสอาคาร</th>
                        <th>อาคารเรียน</th>
                        <th>รหัสห้อง</th>
                        <th>จำนวนที่นั่ง</th>
                        <th>สถานะ</th>
                        <th>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >E12</td>
                        <td >อาคาร 12 ชั้น</td>
                        <td>E12-401</td>
                        <td>100</td>
                        <td>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    label=""
                                    defaultChecked
                                />
                            </Form>
                        </td>
                        <td>
                            <Button variant="light" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td >E12</td>
                        <td >อาคาร 12 ชั้น</td>
                        <td>E12-402</td>
                        <td>100</td>
                        <td>

                        </td>
                        <td>
                            <Button variant="light" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td >E12</td>
                        <td >อาคาร 12 ชั้น</td>
                        <td>E12-403</td>
                        <td>100</td>
                        <td>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch3"
                                    label=""
                                    defaultChecked
                                />
                            </Form>
                        </td>
                        <td>
                            <Button variant="light" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Button variant="light" className="adddata">
                <img src={addbt} className="addicon" alt="add" />
            </Button>
            <Foot/>
        </div>
    </div>
  );
}

export default ClassroomData;*/
