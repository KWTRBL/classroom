import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './DownloadData.css'
import { Component } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'

export default class BuildingData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      fileupload: null,
      showsubmit: false,
      showfailed: false

    }
    this.handleClose = this.handleClose.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.sumbitfile = this.sumbitfile.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClosesubmit = this.handleClosesubmit.bind(this);
    this.handleClosefailed = this.handleClosefailed.bind(this);


  }
  handleOpen() {
    this.setState({
      show: true
    })
  }
  handleClose() {
    this.setState({
      show: false
    })
  }
  handleClosesubmit() {
    this.setState({
      showsubmit:false
    })
  }
  handleClosefailed() {
    this.setState({
      showfailed:false
    })
  }
  
  fileValidation() {
    var fileInput =
      document.getElementById('file');

    var filePath = fileInput.value;

    // Allowing file type 
    var allowedExtensions = /(\.csv)$/i;

    if (!allowedExtensions.exec(filePath)) {
      alert('Invalid file type');
      fileInput.value = '';
      return false;
    }
  }

  handleFileUpload(e) {

    this.fileValidation()

    const file = e.target.files[0]
    this.setState({
      fileupload: file,
    })
  }
  sumbitfile() {
    var formData = new FormData()
    formData.append('uploadfile', this.state.fileupload)
    axios.post('http://localhost:7777/uploadfile',
      formData
    ).then(res => {
      this.setState({
        showsubmit: !this.state.showsubmit
      })

    })
      .catch(
        err => {
          this.setState({
            showfailed: !this.state.showfailed
          })
        }
      );
    this.handleClose()
  }
  render() {
    return (
      <div >
        <Nav />
        <h1 class="state">ข้อมูลตารางสอน</h1>
        <div id="detail">
          <h6 className="typetitle">รับข้อมูลตารางสอน</h6>
          <div className="uploadfile">
            <input type='file' name='fileInput' id="file" className="updata" onChange={this.handleFileUpload} />
            <Button variant="primary" type="file" onClick={this.handleOpen} className="getFile" size="sm">Submit</Button>
            <br/>
          </div>
          <div className="filter">
                <h5 className="departDLfil2">สาขาวิชา</h5>
                <select className="selectdepartDl">
                        <option value="1">วิศวกรรมโทรคมนาคม</option>
                        <option value="2">วิศวกรรมไฟฟ้า</option>
                        <option value="3">วิศวกรรมอิเล็กทรอนิกส์</option>
                        <option value="4">วิศวกรรมระบบควบคุม</option>
                        <option value="5">วิศวกรรมคอมพิวเตอร์</option>
                        <option value="6">วิศวกรรมเครื่องกล</option>
                        <option value="7">วิศวกรรมการวัดคุม</option>
                        <option value="8">วิศวกรรมโยธา</option>
                        <option value="9">วิศวกรรมเกษตร</option>
                        <option value="10">วิศวกรรมเคมี</option>
                        <option value="11">วิศวกรรมอาหาร</option>
                        <option value="12">วิศวกรรมอุตสาหการ</option>
                        <option value="13">วิศวกรรมชีวการแพทย์</option>
                        <option value="14">สำนักงานบริหารหลักสูตรวิศวกรรมสหวิทยาการนานาชาติ</option>
                </select>
                <h5 className="dayfilDl">วันที่เรียน</h5>
                <select className="selectdayDl">
                        <option value="1">จันทร์</option>
                        <option value="2">อังคาร</option>
                        <option value="3">พุธ</option>
                        <option value="4">พฤหัสบดี</option>
                        <option value="5">ศุกร์</option>
                </select>
            </div>
          <table className="Crtable">
                        <thead>
                            <tr className="Buildtable">
                                <th>รหัสวิชา</th>
                                <th>ชื่อวิชา</th>
                                <th>กลุ่ม</th>
                                <th>เวลาที่เรียน</th>
                                <th>สถานะ</th>
                                <th>แก้ไขข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>01006004</td>
                            <td>INDUSTRIAL TRAINING </td>
                            <td>1</td>
                            <td>9.00-12.00</td>
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
                        </tbody>
                    </table>
                    <Button variant="light" className="adddata">
                        <img src={addbt} className="addicon" alt="add" />
                    </Button>

          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>สวัสดี</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
          </Button>
              <Button variant="primary" onClick={this.sumbitfile}>
                Save Changes
          </Button>
            </Modal.Footer>
          </Modal>

          <Modal size="sm" show={this.state.showsubmit} onHide={this.handleClosesubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>บันทึกข้อมูลสำเร็จ</Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>

          <Modal size="sm" show={this.state.showfailed} onHide={this.handleClosefailed}>
            <Modal.Header closeButton>
              <Modal.Title>Failed</Modal.Title>
            </Modal.Header>
            <Modal.Body>บันทึกข้อมูลล้มเหลว</Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
          <Foot />
        </div>
      </div>
    )

  }


}



/*

*/