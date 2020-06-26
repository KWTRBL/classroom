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
import Pagination from 'react-bootstrap/Pagination'
import Modal from 'react-bootstrap/Modal'

export default class BuildingData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      fileupload: null,
      showsubmit: false,
      showfailed: false,
      name: [],
      year: [],
      semester: [],
      curr2: [],
      stateyear: 0,
      yearsearch: null,
      semestersearch: null,
      curr2search: null,
      daysearch: null,
      timestart: null,
      timestop: null,
      result: [1, 2, 3],
      pageclick:1,
      itemperpage:10,
      firstitem:null,
      lastitem:null,

    }
    this.handleClose = this.handleClose.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.sumbitfile = this.sumbitfile.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClosesubmit = this.handleClosesubmit.bind(this);
    this.handleClosefailed = this.handleClosefailed.bind(this);
    this.pageselect = this.pageselect.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
  }
  componentWillMount() {
    axios.get('http://localhost:7777/teachdata')
    .then(res => {
      this.setState({
        name: res.data,
      })
     
    })
    .catch(function (error) {
      console.log(error);
    })

    axios.get('http://localhost:7777/yeardata')
    .then(res => {
        this.setState({
            year: res.data,
        })

    })
    .catch(function (error) {
        console.log(error);
    })

    axios.get('http://localhost:7777/semesterdata')
    .then(res => {
        this.setState({
            semester: res.data,
        })

    })
    .catch(function (error) {
        console.log(error);
    })

    axios.get('http://localhost:7777/zonedata')
    .then(res => {
        this.setState({
            curr2: res.data,
        })

    })
    .catch(function (error) {
        console.log(error);
    })

    this.setState({
        firstitem: 0,
        lastitem: this.state.itemperpage
    })
  }
  pageselect(e) {
    this.setState({ 
        pageclick: parseInt(e.target.textContent),
        firstitem: (this.state.itemperpage * parseInt(e.target.textContent) ) - this.state.itemperpage,
        lastitem: (this.state.itemperpage * parseInt(e.target.textContent) )
    })
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

  searchYear = (event) => {
    let keyword = event.target.value;
    this.setState({ 
      yearsearch: keyword,
      stateyear :0
    })
    //alert(this.state.yearsearch)

    //this.state.stateyear = 0 ;
  }
  searchSemester = (event) => {
      let keyword = event.target.value;
      this.setState({ semestersearch: keyword })
  }
  searchCurr2 = (event) => {
    let keyword = event.target.value;
    this.setState({ curr2search: keyword })
  }
  searchDay = (event) => {
    let keyword = event.target.value;
    this.setState({ daysearch: keyword })
  }
  searchTime = (event) => {
    let keyword = event.target.value;
    if(keyword == 1){
      this.setState({ timestart: "07:00:00",timestop: "13:00:00" })
    }
  }


  render() {
      const item = this.state.name.filter((member) => {
      if (this.state.yearsearch == null){
          this.setState({curr2search:"00",yearsearch:2555,semestersearch:1,daysearch:1})
          return member.curr2_id == "00" && member.year == 2555 && member.semester == 1 && member.teach_day == 1
      }
      else if ((member.curr2_id == this.state.curr2search)&&(member.year == this.state.yearsearch)&&(member.semester == this.state.semestersearch)&&(member.teach_day == this.state.daysearch))
          return member
      }).slice(this.state.firstitem,this.state.lastitem).map(data =>
            <tr>
                <td>{data.subject_id}</td>
                <td>{data.subject_ename}</td>
                <td>{data.section}</td>
                <td>{data.teach_time.split(/[- :]/)[0]}:{data.teach_time.split(/[- :]/)[1]}-{data.teach_time2.split(/[- :]/)[0]}:{data.teach_time2.split(/[- :]/)[1]}</td>
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
      )

      let data_num = this.state.name.filter((member) => {
        if (this.state.yearsearch == null){
          this.setState({curr2search:"00",yearsearch:2555,semestersearch:1,daysearch:1})
          return member.curr2_id == "00" && member.year == 2555 && member.semester == 1 && member.teach_day == 1
        }
        else if ((member.curr2_id == this.state.curr2search)&&(member.year == this.state.yearsearch)&&(member.semester == this.state.semestersearch)&&(member.teach_day == this.state.daysearch))
            return member
      }).length
    
      let items = [];
      for (let number = 1; number <= Math.ceil(data_num/this.state.itemperpage); number++) {
          items.push(
              <Pagination.Item className="selectpage" key={number} active={number == this.state.pageclick} onClick ={this.pageselect}>
                  {number}
              </Pagination.Item>,
          );
      }

      const paginationBasic = (
          <div>
              <Pagination>{items}</Pagination>
              <br />
          </div>
      );
      const term_num = this.state.semester.map((member) => {
        /*
        if (member.year == this.state.yearsearch && this.state.stateyear == 0) {
          
          while (this.state.result.length) {
            this.state.result.pop();
          }
          //this.state.result.push(member.semester)
          this.setState({
            stateyear: 1
          })
        }
        else if (member.year == this.state.yearsearch && this.state.stateyear == 1 ) {
                this.state.result.push(member.semester)
        }
        */
       if(member.year == this.state.yearsearch){
        while (this.state.result.length) {
          this.state.result.pop();
      }
        for (let number = 1; number <= member.semester; number++) {
          this.state.result.push(number)
      }
         
       }
        return member
      })

      const semester = this.state.result.map((data, index) =>
          <option value={data}>{data}</option>
      )
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
                <h5 className="yearDLfil">ปีการศึกษา</h5>
                <select className="selectyearDL" onChange={(e) => this.searchYear(e)}>
                  {
                    this.state.year.map((data, index) =>
                        <option value={data.year}>{data.year}</option>
                    )
                  }
                </select>
                <h5 className="termDLfil">ภาคเรียน</h5>
                <select className="selecttermDL" onChange={(e) => this.searchSemester(e)}>
                  {
                      semester
                  }
                </select>
          </div>
          <div className="filter">
                  <h5 className="departDLfil2">สาขาวิชา</h5>
                  <select className="selectdepartDl" onChange={(e) => this.searchCurr2(e)}>
                  {
                    this.state.curr2.map((data, index) =>
                        <option value={data.curr2_id}>{data.curr2_tname}</option>
                    )
                  }
                  </select>
                  <h5 className="dayfilDl">วันที่เรียน</h5>
                  <select className="selectdayDl" onChange={(e) => this.searchDay(e)}>
                          <option value="1">อาทิตย์</option>
                          <option value="2">จันทร์</option>
                          <option value="3">อังคาร</option>
                          <option value="4">พุธ</option>
                          <option value="5">พฤหัสบดี</option>
                          <option value="6">ศุกร์</option>
                          <option value="7">เสาร์</option>
                  </select>
              </div>
          <table className="Crtable">
                        <thead>
                            <tr className="Downloadtable">
                                <th>รหัสวิชา</th>
                                <th>ชื่อวิชา</th>
                                <th>กลุ่ม</th>
                                <th>เวลาที่เรียน</th>
                                <th>สถานะ</th>
                                <th>แก้ไขข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                          {item}
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
          {paginationBasic}
          <Foot />
        </div>
      </div>
    )

  }


}


