import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
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
        <h1 class="state">โหลดข้อมูลตารางสอน</h1>
        <div id="detail">
          <h4 className="updatetitle">อัพเดทล่าสุด</h4>
          <Button variant="light" className="getReg">รับข้อมูลจากสำนักทะเบียน</Button>
          <Button variant="light" type="file" onClick={this.handleOpen} className="getFile">รับข้อมูลจาก Exel </Button>
          <input type='file' name='fileInput' id="file" onChange={this.handleFileUpload} />

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