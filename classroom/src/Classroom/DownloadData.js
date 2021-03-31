import React from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
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
import Pagination from "react-js-pagination";
import Modal from 'react-bootstrap/Modal'
import Papa from 'papaparse'
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
      pageclick: 1,
      itemperpage: 10,
      firstitem: null,
      lastitem: null,
      editlist: [],
      olddata: [],
      room_status: 1,
      show: false,
      showsubmit: false,
      showfailed: false,
      data: null

    }
    this.handleClose = this.handleClose.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.sumbitfile = this.sumbitfile.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClosesubmit = this.handleClosesubmit.bind(this);
    this.handleClosefailed = this.handleClosefailed.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.pageselectvalue = this.pageselectvalue.bind(this);



    //modal
    this.handleClose = this.handleClose.bind(this);
    this.handleClosesubmit = this.handleClosesubmit.bind(this);
    this.handleClosefailed = this.handleClosefailed.bind(this);


    //edit data
    this.enableedit = this.enableedit.bind(this)
    this.canceledit = this.canceledit.bind(this)
    this.confirmedit = this.confirmedit.bind(this)
    this.handleChange_editroom_status = this.handleChange_editroom_status.bind(this)
  }
  componentWillMount() {
    axios.get('http://localhost:7777/teachdata')
      .then(res => {
        const newIds = this.state.editlist.slice()
        for (var i = 0; i < res.data.length; i++) {
          newIds.push(0)
        }
        console.log(res.data)
        this.setState({
          name: res.data,
          editlist: newIds,
          olddata: JSON.stringify(res.data)
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

    axios.get('http://localhost:7777/curriculum')
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


  pageselectvalue(value) {
    let newId = this.state.editlist.slice()
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0
      }
    }
    this.setState({
      pageclick: parseInt(value),
      firstitem: (this.state.itemperpage * parseInt(value)) - this.state.itemperpage,
      lastitem: (this.state.itemperpage * parseInt(value)),
      editlist: newId,
      name: JSON.parse(this.state.olddata),

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
      showsubmit: false
    })
  }
  handleClosefailed() {
    this.setState({
      showfailed: false
    })
  }

  fileValidation() {
    var fileInput =
      document.getElementById('file');

    var filePath = fileInput.value;

    // Allowing file type 
    var allowedExtensions = /(\.csv)$/i;

    if (!allowedExtensions.exec(filePath)) {
      this.setState({
        data: null
      })
      //alert('Invalid file type');
      fileInput.value = '';
      return false;
    }
    return true
  }

  handleFileUpload(e) {

    //this.fileValidation()

    if (this.fileValidation()) {
      const file = e.target.files[0]


      Papa.parse(file, {
        encoding: "UTF-8",
        complete: (result) => {
          this.setState({
            data: result.data
          })
        }
      });


      this.setState({
        fileupload: file,
      })
    }
  }

  sumbitfile() {
    console.log(this.state.data)
    if (this.state.data == null) {
      this.setState({
        showfailed: !this.state.showfailed
      })
      return this.handleClose()
    }
    axios.post('http://localhost:7777/insert',
      {
        data: this.state.data
      }
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
    let newId = this.state.editlist.slice()
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0
      }
    }
    this.setState({

      yearsearch: keyword,
      stateyear: 0,
      editlist: newId,
      name: JSON.parse(this.state.olddata)
    })
    this.pageselectvalue(1)
  }
  searchSemester = (event) => {
    let newId = this.state.editlist.slice()
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0
      }
    }
    let keyword = event.target.value;
    this.setState({
      semestersearch: keyword,
      editlist: newId,
      name: JSON.parse(this.state.olddata)
    })
    this.pageselectvalue(1)

  }
  searchCurr2 = (event) => {
    let newId = this.state.editlist.slice()
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0
      }
    }
    let keyword = event.target.value;
    this.setState({
      curr2search: keyword,
      editlist: newId,
      name: JSON.parse(this.state.olddata)
    })
    this.pageselectvalue(1)

  }
  searchDay = (event) => {
    let newId = this.state.editlist.slice()
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0
      }
    }
    let keyword = event.target.value;
    this.setState({
      daysearch: keyword,
      editlist: newId,
      name: JSON.parse(this.state.olddata)
    })
    this.pageselectvalue(1)

  }
  searchTime = (event) => {
    let newId = this.state.editlist.slice()
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0
      }
    }
    let keyword = event.target.value;
    if (keyword == 1) {
      this.setState({ timestart: "07:00:00", timestop: "13:00:00" })
    }
    this.pageselectvalue(1)

  }


  //edit data handle
  async handleChange_editroom_status(index, event) {

    const newIds = this.state.name //copy the array
    newIds[index].teach_status = !newIds[index].teach_status//execute the manipulations
    console.log('status:', newIds[index].teach_status, index)
    console.log(newIds)
    await this.setState({ name: newIds }) //set the new state
    // await this.enableedit(index)

  }

  //cancel edit row
  canceledit = (index) => {
    const newIds = this.state.editlist.slice() //copy the array
    newIds[index] = 0//execute the manipulations
    this.setState({
      editlist: newIds,
      name: JSON.parse(this.state.olddata),
    }) //set the new state
  }

  //confirm edit data sent to database
  confirmedit = (index) => {
    let olddata = JSON.parse(this.state.olddata)
    axios
      .post("http://localhost:7777/teachdata/update", {
        year: this.state.name[index].year,
        semester: this.state.name[index].semester,
        curr: this.state.name[index].curr2_id,
        dept: this.state.name[index].dept_id,
        teachday: this.state.name[index].teach_day,
        subject_id: this.state.name[index].subject_id,
        teach_time: this.state.name[index].teach_time,
        teach_time2: this.state.name[index].teach_time2,
        teach_status: this.state.name[index].teach_status,
      })
      .then(response => {
        console.log("response: ", response)

        // do something about response
      })
      .catch(err => {
        console.error(err)
      })
    window.location.reload(false);

  }

  //enable edit row
  enableedit = (index) => {
    const result = this.state.editlist.find((data) => {
      return data == 1
    })
    if (!result) {
      const newIds = this.state.editlist.slice() 
      newIds[index] = 1
      console.log('new editlist', newIds)
      this.setState({ editlist: newIds }) //set the new state
    }
  }


  render() {
    var editjson = []
    const item = this.state.name.filter((member, index) => {
      if (this.state.yearsearch == null) {
        this.setState({ curr2search: "00", yearsearch: 2563, semestersearch: 1, daysearch: 1 })
        if (member.curr2_id == "00" && member.year == 2563 && member.semester == 1 && member.teach_day == 1) {
          editjson.push(index)
          //console.log(editjson)
        }
        return member.curr2_id == "00" && member.year == 2563 && member.semester == 1 && member.teach_day == 1
      }
      else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch)) {
        editjson.push(index)
        //console.log(editjson)
        return member
      }
    }).slice(this.state.firstitem, this.state.lastitem).map((data, index) => {
      if (this.state.editlist[index] == 1) {
        console.log(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index], editjson, index)
        return (
          <tr>
            <td>{data.subject_id}</td>
            <td>{data.subject_ename}</td>
            <td>{data.section}</td>
            <td>{data.teach_time.split(/[- :]/)[0]}:{data.teach_time.split(/[- :]/)[1]}-{data.teach_time2.split(/[- :]/)[0]}:{data.teach_time2.split(/[- :]/)[1]}</td>
            <td>
              <Form>
                <Form.Check
                  type="switch"
                  id={data.subject_id}
                  label=""
                  checked={data.teach_status}
                  onClick={(e) => this.handleChange_editroom_status(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index], e)}
                />
              </Form>
            </td>
            <td>
              <Button variant="link" onClick={() => this.canceledit(index)}>ยกเลิก</Button>

              <Button variant="primary" onClick={() => this.confirmedit(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + index])} >ยืนยัน</Button>
            </td>
          </tr>
        )
      }
      else {
        console.log('edit', editjson, index)
        return (
          <tr>
            <td>{data.subject_id}</td>
            <td>{data.subject_ename}</td>
            <td>{data.section}</td>
            <td>{data.teach_time.split(/[- :]/)[0]}:{data.teach_time.split(/[- :]/)[1]}-{data.teach_time2.split(/[- :]/)[0]}:{data.teach_time2.split(/[- :]/)[1]}</td>
            <td>
              <Form>
                <Form.Check
                  disabled
                  type="switch"
                  id={data.subject_id}
                  label=""
                  checked={data.teach_status}

                />
              </Form>
            </td>
            <td>
              <Button variant="light" className="editdata" onClick={() => this.enableedit(index)}>
                <img src={editbt} className="editicon" alt="edit" />
              </Button>
              <Button variant="light" className="deletedata" onClick={() => this.deletebt(data.room_no)}>
                <img src={deletebt} className="deleteicon" alt="delete" />
              </Button>
            </td>
          </tr>

        )
      }
    }

    )

    let data_num = this.state.name.filter((member) => {
      if (this.state.yearsearch == null) {
        this.setState({ curr2search: "00", yearsearch: 2563, semestersearch: 1, daysearch: 1 })
        return member.curr2_id == "00" && member.year == 2563 && member.semester == 1 && member.teach_day == 1
      }
      else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch))
        return member
    }).length


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
      if (member.year == this.state.yearsearch) {
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
      <div className="page-container">
        <div className="content-wrap">

          <Nav />
          <h1 class="state">ข้อมูลตารางสอน</h1>
          <div id="detail">
            {/* <h5 className="typetitle">รับข้อมูลตารางสอน</h5>
            <div className="uploadfile">
              <input type='file' name='fileInput' id="file" accept=".csv" className="updata" onChange={this.handleFileUpload} />
              <Button variant="primary" type="file" onClick={this.handleOpen} className="getFile" size="sm">Submit</Button>
              <br />
            </div> */}
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
            <Table striped responsive className="Crtable">
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
            </Table>
            <Button variant="light" className="adddata">
              <img src={addbt} className="addicon" alt="add" />
            </Button>

            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>คำเตือน</Modal.Title>
              </Modal.Header>
              <Modal.Body>คุณแน่ใจหรือไม่ที่จะต้องการเพิ่มข้อมูลนี้</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  ยกเลิก
          </Button>
                <Button variant="primary" onClick={this.sumbitfile}>
                  ยืนยัน
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
            <Pagination
              activePage={this.state.pageclick}
              itemsCountPerPage={this.state.itemperpage}
              totalItemsCount={data_num}
              itemClass="page-item"
              linkClass="page-link"
              pageRangeDisplayed={5}
              onChange={this.pageselectvalue}

            />
          </div>
        </div>
        <div className="footer">
          <Foot />
        </div>
      </div>
    )

  }


}


