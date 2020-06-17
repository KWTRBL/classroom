import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './BuildingData.css';
import axios from 'axios';
import Foot from '../Navbar/FooterCr'
import { Component } from 'react';
import { json } from 'body-parser';

export default class BuildingData extends Component {
    constructor(props) {
      super(props);
      this.state = {
          name: [],

      }
  }
  

  
  componentWillMount() {
        axios.get('http://localhost:7777/users')
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
                <h1 class="state">ข้อมูลอาคารเรียน</h1>
                <div id="detail">
                    <table className="Crtable">
                        <thead>
                            <tr>
                                <th>รหัสอาคาร</th>
                                <th>อาคารเรียน</th>
                                <th>จำนวนชั้นทั้งหมด</th>
                                <th>แก้ไขข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.name.map(data => 
                                <tr>
                                <td>{data.building_no}</td>
                                <td>{data.building_name}</td>
                                <td>{data.building_full_name}</td>
                                <td>
                                    <Button variant="light" className="editdata"> 
                                        <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                                    </Button>
                                    <Button variant="light" className="deletedata">
                                        <img src={deletebt} className="deleteicon" alt="delete" /> ลบ
                                    </Button>
                                </td>
                                </tr>
                                )
                        }
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <Button variant="light" className="adddata">
                                        <img src={addbt} className="addicon" alt="add" /> เพิ่ม
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Foot/>
                </div>
            </div>
        );
    }
  
}
  
/*
function BuildingData() {
  return (
    <div >
        <Nav/>
        <h1 class="state">ข้อมูลอาคารเรียน</h1>
        <div id="detail">
            <table className="Crtable">
                <thead>
                    <tr>
                        <th>รหัสอาคาร</th>
                        <th>อาคารเรียน</th>
                        <th>จำนวนชั้นทั้งหมด</th>
                        <th>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>E12</td>
                        <td>อาคาร 12 ชั้น</td>
                        <td>12</td>
                        <td>
                            <Button variant="secondary" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                            </Button>
                            <Button variant="secondary" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" /> ลบ
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td>ME</td>
                        <td>ตึกเครื่องกล</td>
                        <td>4</td>
                        <td>
                            <Button variant="secondary" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                            </Button>
                            <Button variant="secondary" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" /> ลบ
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td >7ชั้น</td>
                        <td >อาคารเฉลิมพระเกียรติ 7 ชั้น</td>
                        <td>7</td>
                        <td>
                            <Button variant="secondary" className="editdata"> 
                                <img src={editbt} className="editicon" alt="edit" /> แก้ไข
                            </Button>
                            <Button variant="secondary" className="deletedata">
                                <img src={deletebt} className="deleteicon" alt="delete" /> ลบ
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <Button variant="secondary" className="adddata">
                                <img src={addbt} className="addicon" alt="add" /> เพิ่ม
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default BuildingData;
*/