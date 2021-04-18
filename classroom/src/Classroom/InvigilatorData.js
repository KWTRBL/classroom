import { Component } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../Navbar/NavIn";
import Foot from "../Navbar/FooterCr";
import Table from "react-bootstrap/Table";
import editbt from "./icon/edit.png";
import deletebt from "./icon/trash.png";
import React from "react";
import addbt from "./icon/plus.png";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Pagination from "react-js-pagination";

import "./InvigilatorData.css";
import { parse } from "papaparse";
export default class FacultyData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showdl: false,
      dept: [],
      teacher: [],
      officer: [],
      deptid: null,
      Typesearch: 1,
      editlist: [],
      olddata: [],
      pageclick: 1,
      itemperpage: 10,
      firstitem: null,
      lastitem: null,
      t_condition: [],
      t_conditionIn: null,
      person: [],
      condition_index: 0,
      t_examroombuilding: [],
      office_type: 1,
      exam_week: [],
      daylist: [],
      freetime_week1: [],
      freetime_week2: [],
      freetime_week3: [],
      freetime_week4: [],
      office_type_search: "",
      person_type_search: "",
      office_id_search: "",
      rows: null,
      //person_id: nulll,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.searchDept = this.searchDept.bind(this);
    this.searchType = this.searchType.bind(this);
    this.enableEdit = this.enableEdit.bind(this);
    this.pageselectvalue = this.pageselectvalue.bind(this);

    //delete row
    this.deletebt = this.deletebt.bind(this)
    this.confirmdelete = this.confirmdelete.bind(this);
    //modal
    this.handleClosedl = this.handleClosedl.bind(this);
    this.handleClosesubmit = this.handleClosesubmit.bind(this);
    this.handleClosefailed = this.handleClosefailed.bind(this);

    //edit
    this.handleChange_editPrename = this.handleChange_editPrename.bind(this)
    this.handleChange_editFirstname = this.handleChange_editFirstname.bind(this)
    this.handleChange_editLastname = this.handleChange_editLastname.bind(this)
    this.handleChange_editPosition = this.handleChange_editPosition.bind(this)
    this.handleChange_editOffice_id = this.handleChange_editOffice_id.bind(this)

    //add row
    this.addrow = this.addrow.bind(this);
    this.handleChange_Person_id = this.handleChange_Person_id.bind(this)
    this.handleChange_Prename = this.handleChange_Prename.bind(this)
    this.handleChange_Firstname = this.handleChange_Firstname.bind(this)
    this.handleChange_Lastname = this.handleChange_Lastname.bind(this)
    this.handleChange_Position = this.handleChange_Position.bind(this)
    this.handleChange_Office_id = this.handleChange_Office_id.bind(this)
    this.handleChange_conditionstatus = this.handleChange_conditionstatus.bind(this)

    this.componentWillMount = this.componentWillMount.bind(this);
  }



  //handle modal
  handleClosedl() {
    this.setState({
      showdl: false
    })
  }

  //edit
  handleChange_editPrename(index, e) {
    //console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].Prename = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  }
  handleChange_editFirstname(index, e) {
    //console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].Firstname = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  }
  handleChange_editLastname(index, e) {
    //console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].Lastname = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  }
  handleChange_editPosition(index, e) {
    //console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].position = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  }
  handleChange_editOffice_id(index, e) {
    //console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].Office_id = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  }

  //handle addrow data 
  handleChange_Person_id(event) {
    this.setState({ person_id: event.target.value })
  }
  handleChange_Office_id(event) {
    this.setState({ Office_id: event.target.value })
  }
  handleChange_Prename(event) {
    this.setState({ Prename: event.target.value })
  }
  handleChange_Firstname(event) {
    this.setState({ Firstname: event.target.value })
  }
  handleChange_Lastname(event) {
    this.setState({ Lastname: event.target.value })
  }
  handleChange_Position(event) {
    console.log(event.target.value)
    this.setState({ position: event.target.value })
  }
  handleChange_conditionstatus = (event) => {
    console.log(event.target.value);
    // const newIds = this.state.t_conditionIn; //copy the array
    // newIds.condition_status = event.target.value; //execute the manipulations
    this.setState({ t_conditionIn: event.target.value }); //set the new state
    console.log(this.state.t_conditionIn);
    //console.log(newIds)
    //this.setState({ t_condition: event.target.value }); //set the new state
  };

  //insert row confirm 
  confirmdata = () => {
    if(this.state.Prename == null || this.state.Firstname == null || this.state.Lastname == null|| (this.state.position == null&& this.state.Typesearch == 1 )|| this.state.t_conditionIn == null || this.state.person_id == null ||
      this.state.Prename == '' || this.state.Firstname == '' || this.state.Lastname == ''|| (this.state.position == '' && this.state.Typesearch == 1)  || this.state.t_conditionIn == '' || this.state.person_id == ''
      ){
      alert('กรุณาใส่ข้อมูลให้ครบ')
      return
    }
    axios
      .post("http://localhost:7777/t_condition/insert", {
        data: {
          Prename: this.state.Prename,
          Firstname: this.state.Firstname,
          Lastname: this.state.Lastname,
          Position: this.state.position,
          Office_id: this.state.Office_id == null? this.state.deptid:this.state.Office_id,
          office_type: this.state.office_type_search,
          condition_status: this.state.t_conditionIn,
          person_id: this.state.person_id,
          person_type: this.state.Typesearch
        }
      })
      .then(response => {
        
        console.log("response: ", response)
        this.delrow()
        axios
        .get("http://localhost:7777/t_condition")
        .then((res) => {
          const newIds = []
          for (var i = 0; i < res.data.length; i++) {
            newIds.push(0);
          }
          console.log(res.data)
          this.setState({
            t_condition: res.data,
            editlist: newIds,
            olddata: JSON.stringify(res.data),
          });
        })
        .catch(function (error) {
          console.log(error);
        });
        // do something about response
      })
      .catch(err => {
        console.error(err)
      })
    // window.location.reload(false);

  }

  //show row input for insert  บรรทัดนี้
  addrow = () => {
    //console.log("add")
    // this.setState({
    //   office_id_search:"01"
    // })
    if(this.state.office_type_search==2){
      this.setState({
        Office_id:'50'
      })
    }
    const office_check = []
    const office_nameList = this.state.dept.map((tabledata, index) => {
      office_check.push(tabledata.Office_id)
      if (tabledata.Office_id >= 50)
        return <option value={tabledata.Office_id} >{tabledata.Office_name}</option>
    })
    if (this.state.Typesearch == 1) {
      return (
        this.setState({
          rows: <tr>
            <td>
              <input
                value={this.state.person_id}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                onChange={this.handleChange_Person_id}
              />
            </td>
            <td>
              <input
                value={this.state.Prename}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                onChange={this.handleChange_Prename}
              />
            </td>
            <td>
              <input
                value={this.state.Firstname}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                onChange={this.handleChange_Firstname}
              />
            </td>
            <td>
              <input
                value={this.state.Lastname}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                onChange={this.handleChange_Lastname}
              />
            </td>
            <td>
              <input
                value={this.state.position}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                onChange={this.handleChange_Position}
              />
            </td>
            <td>
              <Form>
                {["radio"].map((type) => (
                  <div key={`inline-${type}`}>
                    <Form.Group className="radiotable">
                      <Form.Check
                        inline
                        label="ไม่คุม"
                        name="line"
                        value="0"
                        //onClick={this.handleChangeCondition_status}
                        onClick={(e) => this.handleChange_conditionstatus(e)}
                        type={type}
                        id={`inline-${type}-1`}
                      />

                      <Form.Check
                        inline
                        label="คุม"
                        name="line"
                        value="1"
                        //onClick={this.handleChangeCondition_status}
                        onClick={(e) => this.handleChange_conditionstatus(e)}
                        type={type}
                        id={`inline-${type}-1`}
                      />
                      <Form.Check
                        inline
                        label="คุม 1 ครั้ง"
                        name="line"
                        value="2"
                        //onClick={this.handleChangeCondition_status}
                        onClick={(e) => this.handleChange_conditionstatus(e)}
                        type={type}
                        id={`inline-${type}-2`}
                      />
                    </Form.Group>
                  </div>
                ))}
              </Form>
            </td>
            <td>
              <Button type="primary" disabled>กำหนดเงื่อนไข</Button>
            </td>
            <td>
              <Button variant="link" onClick={() => this.delrow()}>ยกเลิก</Button>
              <Button variant="primary" onClick={() => this.confirmdata()} >ยืนยัน</Button>
            </td>
            <td>
              <Button variant="light" className="deletedata">
                <img src={deletebt} className="deleteicon" alt="delete" />
              </Button>
            </td>
          </tr>


        })
      )
    }
    else{
      this.setState({
        position: "",
      })
      console.log(this.state)
      if(this.state.office_type_search==1){
        return (
          this.setState({
            rows: <tr>
              <td>
                <input
                  value={this.state.person_id}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  onChange={this.handleChange_Person_id}
                />
              </td>
              <td>
                <input
                  value={this.state.Prename}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  onChange={this.handleChange_Prename}
                />
              </td>
              <td>
                <input
                  value={this.state.Firstname}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  onChange={this.handleChange_Firstname}
                />
              </td>
              <td>
                <input
                  value={this.state.Lastname}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  onChange={this.handleChange_Lastname}
                />
              </td>
              <td>
                {this.state.dept.map((data) => {
                  if (this.state.deptid == data.Office_id){
                  return (
                    <option selected value={data.Office_id}>{data.Office_name}</option>
                  )
                }
                })
              }
              </td>
              <td>
                <Form>
                  {["radio"].map((type) => (
                    <div key={`inline-${type}`}>
                      <Form.Group className="radiotable">
                        <Form.Check
                          inline
                          label="ไม่คุม"
                          name="line"
                          value="0"
                          //onClick={this.handleChangeCondition_status}
                          onClick={(e) => this.handleChange_conditionstatus(e)}
                          type={type}
                          id={`inline-${type}-1`}
                        />
  
                        <Form.Check
                          inline
                          label="คุม"
                          name="line"
                          value="1"
                          //onClick={this.handleChangeCondition_status}
                          onClick={(e) => this.handleChange_conditionstatus(e)}
                          type={type}
                          id={`inline-${type}-1`}
                        />
                        <Form.Check
                          inline
                          label="คุม 1 ครั้ง"
                          name="line"
                          value="2"
                          //onClick={this.handleChangeCondition_status}
                          onClick={(e) => this.handleChange_conditionstatus(e)}
                          type={type}
                          id={`inline-${type}-2`}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </Form>
              </td>
              <td>
                <Button type="primary" disabled>กำหนดเงื่อนไข</Button>
              </td>
              <td>
                <Button variant="link" onClick={() => this.delrow()}>ยกเลิก</Button>
                <Button variant="primary" onClick={() => this.confirmdata()} >ยืนยัน</Button>
              </td>
              <td>
                <Button variant="light" className="deletedata">
                  <img src={deletebt} className="deleteicon" alt="delete" />
                </Button>
              </td>
            </tr>
          })
        )
      }
      if(this.state.office_type_search==2){
        return (
          this.setState({
            rows: <tr>
              <td>
                <input
                  value={this.state.person_id}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  onChange={this.handleChange_Person_id}
                />
              </td>
              <td>
                <input
                  value={this.state.Prename}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  onChange={this.handleChange_Prename}
                />
              </td>
              <td>
                <input
                  value={this.state.Firstname}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  onChange={this.handleChange_Firstname}
                />
              </td>
              <td>
                <input
                  value={this.state.Lastname}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  onChange={this.handleChange_Lastname}
                />
              </td>
              <td>
                <select onChange={(e)=>  this.handleChange_Office_id(e)}>
                  {
                    office_nameList
                  }
                </select>
              </td>
              <td>
                <Form>
                  {["radio"].map((type) => (
                    <div key={`inline-${type}`}>
                      <Form.Group className="radiotable">
                        <Form.Check
                          inline
                          label="ไม่คุม"
                          name="line"
                          value="0"
                          //onClick={this.handleChangeCondition_status}
                          onClick={(e) => this.handleChange_conditionstatus(e)}
                          type={type}
                          id={`inline-${type}-1`}
                        />
  
                        <Form.Check
                          inline
                          label="คุม"
                          name="line"
                          value="1"
                          //onClick={this.handleChangeCondition_status}
                          onClick={(e) => this.handleChange_conditionstatus(e)}
                          type={type}
                          id={`inline-${type}-1`}
                        />
                        <Form.Check
                          inline
                          label="คุม 1 ครั้ง"
                          name="line"
                          value="2"
                          //onClick={this.handleChangeCondition_status}
                          onClick={(e) => this.handleChange_conditionstatus(e)}
                          type={type}
                          id={`inline-${type}-2`}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </Form>
              </td>
              <td>
                <Button type="primary" disabled>กำหนดเงื่อนไข</Button>
              </td>
              <td>
                <Button variant="link" onClick={() => this.delrow()}>ยกเลิก</Button>
                <Button variant="primary" onClick={() => this.confirmdata()} >ยืนยัน</Button>
              </td>
              <td>
                <Button variant="light" className="deletedata">
                  <img src={deletebt} className="deleteicon" alt="delete" />
                </Button>
              </td>
            </tr>
          })
        )
      }
    }
  }


  handleClosesubmit() {
    axios
    .get("http://localhost:7777/t_condition")
    .then((res) => {
      const newIds = []
      for (var i = 0; i < res.data.length; i++) {
        newIds.push(0);
      }
      console.log(res.data)
      this.setState({
        t_condition: res.data,
        editlist: newIds,
        olddata: JSON.stringify(res.data),
        showsubmit: false
      });
    })
    .catch(function (error) {
      console.log(error);
    });
    // this.setState({
    //   showsubmit: false
    // })
    // window.location.reload(false);
  }

  handleClosefailed() {
    axios
    .get("http://localhost:7777/t_condition")
    .then((res) => {
      const newIds = []
      for (var i = 0; i < res.data.length; i++) {
        newIds.push(0);
      }
      console.log(res.data)
      this.setState({
        t_condition: res.data,
        editlist: newIds,
        olddata: JSON.stringify(res.data),
        showfailed: false
      });
    })
    .catch(function (error) {
      console.log(error);
    });
    // this.setState({
    //   showfailed: false
    // })
    // window.location.reload(false);

  }

  //delete row input
  delrow = () => {
    this.setState({
      rows: null,
      person_id: null,
      position:null,
      Firstname:null,
      Prename:null,
      Lastname:null,
      Office_id:null

    })
    //console.log("aa")
  }

  //delete row button 
  deletebt = (tabledata) => {
    //console.log(tabledata)
    this.setState({
      showdl: true,
      person_id: tabledata
    })
  }

  //confirm delete row in table function
  confirmdelete() {
    axios
      .delete("http://localhost:7777/person/delete", { data: { person_id: this.state.person_id } })
      .then(response => {
        console.log("response: ", response)
        if (response.data == "Success") {
          this.setState({
            showsubmit: !this.state.showsubmit
          })
        }
        else {
          this.setState({
            showfailed: !this.state.showfailed
          })
        }
        // do something about response
      })
      .catch(err => {
        console.error(err)
      })
    this.handleClosedl()
  }

  componentWillMount() {
    Date.prototype.addDays = function (days) {
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    console.log(new Date().addDays(1))
    function getDates(startDate, stopDate) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
        dateArray.push(currentDate);
        currentDate = currentDate.addDays(1);
      }
      return dateArray;
    }

    axios
      .get("http://localhost:7777/t_office")
      .then((res) => {
        this.setState({
          dept: res.data,
          deptid: res.data[0].Office_id,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:7777/t_examroombuilding")
      .then((res) => {
        this.setState({
          t_examroombuilding: res.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:7777/t_condition")
      .then((res) => {
        const newIds = this.state.editlist.slice();
        for (var i = 0; i < res.data.length; i++) {
          newIds.push(0);
        }
        console.log(res.data)
        this.setState({
          office_type_search: "1",
          t_condition: res.data,
          editlist: newIds,
          olddata: JSON.stringify(res.data),
          office_id_search:"01"

        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:7777/person")
      .then((res) => {
        this.setState({
          person: res.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:7777/examweekrecent")
      .then((res) => {
        // console.log(res.data[0].year, res.data[0].week1_start, res.data[0].week1_end)
        var listdata = []
        var datearray = getDates(new Date(res.data[0].week1_start), new Date(res.data[0].week1_end))
        listdata.push(datearray)
        var datearray = getDates(new Date(res.data[0].week2_start), new Date(res.data[0].week2_end))
        listdata.push(datearray)
        var datearray = getDates(new Date(res.data[0].week3_start), new Date(res.data[0].week3_end))
        listdata.push(datearray)
        var datearray = getDates(new Date(res.data[0].week4_start), new Date(res.data[0].week4_end))
        listdata.push(datearray)
        this.setState({
          exam_week: res.data,
          daylist: listdata
        });
      })
      .catch(function (error) {
        console.log(error);
      });


    this.setState({
      firstitem: 0,
      lastitem: this.state.itemperpage,
    });
  }

  pageselectvalue(value) {
    let newId = this.state.editlist.slice();
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0;
      }
    }
    this.setState({
      pageclick: parseInt(value),
      firstitem:
        this.state.itemperpage * parseInt(value) - this.state.itemperpage,
      lastitem: this.state.itemperpage * parseInt(value),
      editlist: newId,
      teacher: JSON.parse(this.state.olddata),
    });
  }

  searchDept = (event) => {
    let newId = this.state.editlist.slice();
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0;
      }
    }
    let keyword = event.target.value;
    this.setState({
      deptid: keyword,
      office_id_search: keyword,
      editlist: newId,
      teacher: JSON.parse(this.state.olddata),
    });
    this.pageselectvalue(1);
    this.delrow();
  };

  searchType = (event) => {
    //console.log(!(this.state.Typesearch == 1) || this.state.Typesearch == 2);

    let newId = this.state.editlist.slice();
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0;
      }
    }
    let keyword = event.target.value;
    this.setState({
      office_type: 1,
      office_type_search: '1',
      deptid: "01",
      person_type_search: keyword,
      Typesearch: parseInt(keyword),
      editlist: newId,
      teacher: JSON.parse(this.state.olddata),

    });
    this.pageselectvalue(1);
    this.delrow();
  };

  searchOfficeType = (event) => {
    console.log(this.state.Typesearch, this.state.office_type);
    let newId = this.state.editlist.slice();
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0;
      }
    }
    let keyword = event.target.value;
    this.setState({
      deptid: "01",
      office_type: parseInt(keyword),
      office_type_search: keyword,
      editlist: newId,
      teacher: JSON.parse(this.state.olddata),
    });
    this.pageselectvalue(1);
    this.delrow();
  };

  handleOpen(index) {


    var freetime_1 = this.state.t_condition[index].freetime_week1
    var freetime_1_str = freetime_1.length != 0 ? freetime_1.split(',') : []
    var freetime_2 = this.state.t_condition[index].freetime_week2
    var freetime_2_str = freetime_2.length != 0 ? freetime_2.split(',') : []
    var freetime_3 = this.state.t_condition[index].freetime_week3
    var freetime_3_str = freetime_3.length != 0 ? freetime_3.split(',') : []
    var freetime_4 = this.state.t_condition[index].freetime_week4
    var freetime_4_str = freetime_4.length != 0 ? freetime_4.split(',') : []

    this.setState({
      condition_index: index,
      show: true,
      freetime_week1: freetime_1_str,
      freetime_week2: freetime_2_str,
      freetime_week3: freetime_3_str,
      freetime_week4: freetime_4_str,
    });
  }
  handleClose() {
    this.setState({
      show: false,
    });
  }

  OnChangeCondition_status = (index, e) => {
    console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].condition_status = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  };

  OnChangeOwn_subject = (index, e) => {
    console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].own_subject = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  };

  OnChangeBuilding_no = (index, e) => {
    console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].building_no = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  };

  OnChangeCondition_week = (index, e) => {
    console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].condition_week = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  };

  OnChangeCondition_time = (index, e) => {
    console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].condition_time = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  };

  OnChangeCondition_weekend = (index, e) => {
    console.log(index, e.target.value);
    const newIds = this.state.t_condition; //copy the array
    newIds[index].condition_weekend = e.target.value; //execute the manipulations
    this.setState({ t_condition: newIds }); //set the new state
  };

  enableEdit = (index) => {
    const newIds = this.state.editlist; //copy the array
    newIds[index] = 1; //execute the manipulations
    this.setState({
      editlist: newIds,
      condition_index: index

    }); //set the new state
  };

  cancelEdit = (index) => {
    const newIds = this.state.editlist.slice(); //copy the array
    newIds[index] = 0; //execute the manipulations
    this.setState({
      editlist: newIds,
      t_condition: JSON.parse(this.state.olddata),
    }); //set the new state
  };

  condition_confirm = (index) => {
    let olddata = JSON.parse(this.state.olddata);
    console.log(this.state.t_condition[index], index);
    axios
      .post("http://localhost:7777/t_condition/update", {
        Prename: this.state.t_condition[index].Prename,
        Firstname: this.state.t_condition[index].Firstname,
        Lastname: this.state.t_condition[index].Lastname,
        Position: this.state.t_condition[index].position,
        Office_id: this.state.t_condition[index].faculty_id,
        condition_status: this.state.t_condition[index].condition_status,
        person_id: this.state.t_condition[index].person_id,
        building_no: this.state.t_condition[index].building_no,
        own_subject: this.state.t_condition[index].own_subject,
        condition_week: this.state.t_condition[index].condition_week,
        condition_time: this.state.t_condition[index].condition_time,
        condition_weekend: this.state.t_condition[index].condition_weekend,
        freetime_week1: this.state.freetime_week1.join(),
        freetime_week2: this.state.freetime_week2.join(),
        freetime_week3: this.state.freetime_week3.join(),
        freetime_week4: this.state.freetime_week4.join(),

      })
      .then((response) => {
        console.log("response: ", response);
        axios
        .get("http://localhost:7777/t_condition")
        .then((res) => {
          const newIds = []
          for (var i = 0; i < res.data.length; i++) {
            newIds.push(0);
          }
          console.log(res.data)
          this.setState({
            t_condition: res.data,
            editlist: newIds,
            olddata: JSON.stringify(res.data),
            show:false
          });
        })
        .catch(function (error) {
          console.log(error);
        });

      })
      .catch((err) => {
        console.error(err);
      });
    // window.location.reload(false);
  };

  handleChangeWeek_1_toggle = (event, data) => {
    var freetimelist = this.state.freetime_week1
    if (event.target.checked == false) {
      freetimelist.push(data)
    } else {
      freetimelist = this.state.freetime_week1.filter((element, index) => {
        return element != data
      })
    }
    freetimelist.sort()
    this.setState({
      freetime_week1: freetimelist
    })
  }
  handleChangeWeek_2_toggle = (event, data) => {
    var freetimelist = this.state.freetime_week2
    if (event.target.checked == false) {
      freetimelist.push(data)
    } else {
      freetimelist = this.state.freetime_week2.filter((element, index) => {
        return element != data
      })
    }
    freetimelist.sort()
    this.setState({
      freetime_week2: freetimelist
    })
  }
  handleChangeWeek_3_toggle = (event, data) => {
    var freetimelist = this.state.freetime_week3
    if (event.target.checked == false) {
      freetimelist.push(data)
    } else {
      freetimelist = this.state.freetime_week3.filter((element, index) => {
        return element != data
      })
    }
    freetimelist.sort()
    this.setState({
      freetime_week3: freetimelist
    })
  }
  handleChangeWeek_4_toggle = (event, data) => {
    var freetimelist = this.state.freetime_week4
    if (event.target.checked == false) {
      freetimelist.push(data)
    } else {
      freetimelist = this.state.freetime_week4.filter((element, index) => {
        return element != data
      })
    }
    freetimelist.sort()
    this.setState({
      freetime_week4: freetimelist
    })
  }

  render() {
    var editjson = [];
    var tabledata = [];
    var datalength = 0;
    var typestring = ["ตำแหน่ง", "สำนักงาน"];
    var person_type = ["อาจารย์", "เจ้าหน้าที่"];
    var type_search = this.state.Typesearch;

    const office_check = []
    var office_id_data = this.state.t_condition.filter((data, index) => {
      if (index == this.state.condition_index) {
        // console.log('data edit', index)
        return data.faculty_id
      }
    }
    )
    // console.log(office_id_data)
    const office_nameList = this.state.dept.map((tabledata, index) => {
      office_check.push(tabledata.Office_id)
      // console.log(office_id_data)
      let officedata = office_id_data.length == 0 ? '9999' : office_id_data[0].faculty_id
      if (tabledata.Office_id >= 50)
        return <option value={tabledata.Office_id} selected={officedata == tabledata.Office_id} >{tabledata.Office_name}</option>
    })

    tabledata = this.state.t_condition
      .filter((data, index) => {
        if (type_search == parseInt(data.person_type)) {
          if (type_search == 1) {
            if (this.state.deptid == data.faculty_id) {
              editjson.push(index);
              return data;
            }
          } else {
            if (data.Office_type == this.state.office_type) {
              if (
                data.Office_type == 2 ||
                (this.state.deptid == data.faculty_id && data.Office_type == 1)
              ) {
                editjson.push(index);
                return data;
              }
            }
          }
        }
      })
      .slice(this.state.firstitem, this.state.lastitem)
      .map((tabledata, tableindex) => {
        if (type_search == parseInt(tabledata.person_type)) {
          if (type_search == 1) {
            if (this.state.deptid == tabledata.faculty_id) {
              return (
                <tr>
                  <td>{tabledata.person_id}</td>
                  <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Prename : (<input
                    value={tabledata.Prename}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    onChange={(e) => this.handleChange_editPrename(
                      editjson[
                      (this.state.pageclick - 1) *
                      this.state.itemperpage +
                      tableindex
                      ]
                      , e)}
                  />)}</td>
                  <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Firstname : (<input
                    value={tabledata.Firstname}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    onChange={(e) => this.handleChange_editFirstname(
                      editjson[
                      (this.state.pageclick - 1) *
                      this.state.itemperpage +
                      tableindex
                      ]
                      , e)}
                  />)}</td>
                  <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Lastname : (<input
                    value={tabledata.Lastname}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    onChange={(e) => this.handleChange_editLastname(
                      editjson[
                      (this.state.pageclick - 1) *
                      this.state.itemperpage +
                      tableindex
                      ]
                      , e)}
                  />)}</td>
                  <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.position : (<input
                    value={tabledata.position}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    onChange={(e) => this.handleChange_editPosition(
                      editjson[
                      (this.state.pageclick - 1) *
                      this.state.itemperpage +
                      tableindex
                      ]
                      , e)}
                  />)}</td>
                  <td>
                    <Form>
                      {["radio"].map((type) => (
                        <div key={`inline-${type}`}>
                          <Form.Group className="radiotable">
                            <Form.Check
                              inline
                              label="ไม่คุม"
                              name="line"
                              value="0"
                              disabled={
                                !this.state.editlist[
                                editjson[
                                (this.state.pageclick - 1) *
                                this.state.itemperpage +
                                tableindex
                                ]
                                ]
                              }
                              onClick={(e) =>
                                this.OnChangeCondition_status(
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ],
                                  e
                                )
                              }
                              checked={tabledata.condition_status % 3 == 0}
                              type={type}
                              id={`inline-${type}-1`}
                            />

                            <Form.Check
                              inline
                              label="คุม"
                              name="line"
                              value="1"
                              disabled={
                                !this.state.editlist[
                                editjson[
                                (this.state.pageclick - 1) *
                                this.state.itemperpage +
                                tableindex
                                ]
                                ]
                              }
                              onClick={(e) =>
                                this.OnChangeCondition_status(
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ],
                                  e
                                )
                              }
                              checked={tabledata.condition_status % 3 == 1}
                              type={type}
                              id={`inline-${type}-1`}
                            />
                            <Form.Check
                              inline
                              label="คุม 1 ครั้ง"
                              name="line"
                              value="2"
                              disabled={
                                !this.state.editlist[
                                editjson[
                                (this.state.pageclick - 1) *
                                this.state.itemperpage +
                                tableindex
                                ]
                                ]
                              }
                              onClick={(e) =>
                                this.OnChangeCondition_status(
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ],
                                  e
                                )
                              }
                              checked={tabledata.condition_status % 3 == 2}
                              type={type}
                              id={`inline-${type}-2`}
                            />
                          </Form.Group>
                        </div>
                      ))}
                    </Form>
                  </td>
                  <td>
                    <Button
                      type="primary"
                      disabled={
                        !this.state.editlist[
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        ]
                      }
                      onClick={() =>
                        this.handleOpen(
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                        )
                      }
                    >
                      กำหนดเงื่อนไข
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="light"
                      className="editdata"
                      hidden={
                        this.state.editlist[
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        ]
                      }
                      onClick={() =>
                        this.enableEdit(
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                        )
                      }
                    >
                      <img src={editbt} className="editicon" alt="edit" />
                    </Button>

                    <Button
                      hidden={
                        !this.state.editlist[
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        ]
                      }
                      variant="link"
                      onClick={() =>
                        this.cancelEdit(
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                        )
                      }
                    >
                      ยกเลิก
                    </Button>

                    <Button
                      hidden={
                        !this.state.editlist[
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        ]
                      }
                      variant="primary"
                      onClick={() =>
                        this.condition_confirm(
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                        )
                      }
                    >
                      ยืนยัน
                    </Button>
                  </td>
                  <td>
                    <Button variant="light" className="deletedata" onClick={() => this.deletebt(tabledata.person_id)}>
                      <img src={deletebt} className="deleteicon" alt="delete" />
                    </Button>
                  </td>
                </tr>
              );
            }
          } else {
            if (tabledata.Office_type == this.state.office_type) {
              if (
                (this.state.deptid == tabledata.faculty_id &&
                  tabledata.Office_type == 1)
              )
                return (
                  <tr>
                    <td>{tabledata.person_id}</td>
                    <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Prename : (<input
                      value={tabledata.Prename}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      onChange={(e) => this.handleChange_editPrename(
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        , e)}
                    />)}</td>
                    <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Firstname : (<input
                      value={tabledata.Firstname}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      onChange={(e) => this.handleChange_editFirstname(
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        , e)}
                    />)}</td>
                    <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Lastname : (<input
                      value={tabledata.Lastname}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      onChange={(e) => this.handleChange_editLastname(
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        , e)}
                    />)}</td>
                    <td>{tabledata.Office_name}</td>
                    <td>
                      <Form>
                        {["radio"].map((type) => (
                          <div key={`inline-${type}`}>
                            <Form.Group className="radiotable">
                              <Form.Check
                                inline
                                label="ไม่คุม"
                                name="line"
                                disabled={
                                  !this.state.editlist[
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ]
                                  ]
                                }
                                value="0"
                                onClick={(e) =>
                                  this.OnChangeCondition_status(
                                    editjson[
                                    (this.state.pageclick - 1) *
                                    this.state.itemperpage +
                                    tableindex
                                    ],
                                    e
                                  )
                                }
                                checked={tabledata.condition_status % 3 == 0}
                                type={type}
                                id={`inline-${type}-1`}
                              />

                              <Form.Check
                                inline
                                label="คุม"
                                name="line"
                                value="1"
                                disabled={
                                  !this.state.editlist[
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ]
                                  ]
                                }
                                onClick={(e) =>
                                  this.OnChangeCondition_status(
                                    editjson[
                                    (this.state.pageclick - 1) *
                                    this.state.itemperpage +
                                    tableindex
                                    ],
                                    e
                                  )
                                }
                                checked={tabledata.condition_status % 3 == 1}
                                type={type}
                                id={`inline-${type}-1`}
                              />
                              <Form.Check
                                inline
                                label="คุม 1 ครั้ง"
                                value="2"
                                disabled={
                                  !this.state.editlist[
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ]
                                  ]
                                }
                                onClick={(e) =>
                                  this.OnChangeCondition_status(
                                    editjson[
                                    (this.state.pageclick - 1) *
                                    this.state.itemperpage +
                                    tableindex
                                    ],
                                    e
                                  )
                                }
                                name="line"
                                checked={tabledata.condition_status % 3 == 2}
                                type={type}
                                id={`inline-${type}-2`}
                              />
                            </Form.Group>
                          </div>
                        ))}
                      </Form>
                    </td>
                    <td>
                      <Button
                        type="primary"
                        disabled={
                          !this.state.editlist[
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                          ]
                        }
                        onClick={() =>
                          this.handleOpen(
                            editjson[
                            (this.state.pageclick - 1) *
                            this.state.itemperpage +
                            tableindex
                            ]
                          )
                        }
                      >
                        กำหนดเงื่อนไข
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="light"
                        className="editdata"
                        hidden={
                          this.state.editlist[
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                          ]
                        }
                        onClick={() =>
                          this.enableEdit(
                            editjson[
                            (this.state.pageclick - 1) *
                            this.state.itemperpage +
                            tableindex
                            ]
                          )
                        }
                      >
                        <img src={editbt} className="editicon" alt="edit" />
                      </Button>

                      <Button
                        hidden={
                          !this.state.editlist[
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                          ]
                        }
                        variant="link"
                        onClick={() =>
                          this.cancelEdit(
                            editjson[
                            (this.state.pageclick - 1) *
                            this.state.itemperpage +
                            tableindex
                            ]
                          )
                        }
                      >
                        ยกเลิก
                      </Button>

                      <Button
                        hidden={
                          !this.state.editlist[
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                          ]
                        }
                        variant="primary"
                        onClick={() =>
                          this.condition_confirm(
                            editjson[
                            (this.state.pageclick - 1) *
                            this.state.itemperpage +
                            tableindex
                            ]
                          )
                        }
                      >
                        ยืนยัน
                      </Button>
                    </td>
                    <td>
                      <Button variant="light" className="deletedata" onClick={() => this.deletebt(tabledata.person_id)}>
                        <img
                          src={deletebt}
                          className="deleteicon"
                          alt="delete"
                        />
                      </Button>
                    </td>
                  </tr>
                );
              if (
                tabledata.Office_type == 2
              )
                return (
                  <tr>
                    <td>{tabledata.person_id}</td>
                    <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Prename : (<input
                      value={tabledata.Prename}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      onChange={(e) => this.handleChange_editPrename(
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        , e)}
                    />)}</td>
                    <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Firstname : (<input
                      value={tabledata.Firstname}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      onChange={(e) => this.handleChange_editFirstname(
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        , e)}
                    />)}</td>
                    <td>{this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Lastname : (<input
                      value={tabledata.Lastname}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      onChange={(e) => this.handleChange_editLastname(
                        editjson[
                        (this.state.pageclick - 1) *
                        this.state.itemperpage +
                        tableindex
                        ]
                        , e)}
                    />)}</td>
                    <td>
                      {this.state.editlist[editjson[(this.state.pageclick - 1) * this.state.itemperpage + tableindex]] == 0 ? tabledata.Office_name : (<select onChange={(e) => this.handleChange_editOffice_id(editjson[((this.state.pageclick - 1) * this.state.itemperpage) + tableindex], e)}>
                        {
                          office_nameList
                        }
                      </select>)}
                    </td>
                    <td>
                      <Form>
                        {["radio"].map((type) => (
                          <div key={`inline-${type}`}>
                            <Form.Group className="radiotable">
                              <Form.Check
                                inline
                                label="ไม่คุม"
                                name="line"
                                disabled={
                                  !this.state.editlist[
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ]
                                  ]
                                }
                                value="0"
                                onClick={(e) =>
                                  this.OnChangeCondition_status(
                                    editjson[
                                    (this.state.pageclick - 1) *
                                    this.state.itemperpage +
                                    tableindex
                                    ],
                                    e
                                  )
                                }
                                checked={tabledata.condition_status % 3 == 0}
                                type={type}
                                id={`inline-${type}-1`}
                              />

                              <Form.Check
                                inline
                                label="คุม"
                                name="line"
                                value="1"
                                disabled={
                                  !this.state.editlist[
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ]
                                  ]
                                }
                                onClick={(e) =>
                                  this.OnChangeCondition_status(
                                    editjson[
                                    (this.state.pageclick - 1) *
                                    this.state.itemperpage +
                                    tableindex
                                    ],
                                    e
                                  )
                                }
                                checked={tabledata.condition_status % 3 == 1}
                                type={type}
                                id={`inline-${type}-1`}
                              />
                              <Form.Check
                                inline
                                label="คุม 1 ครั้ง"
                                value="2"
                                disabled={
                                  !this.state.editlist[
                                  editjson[
                                  (this.state.pageclick - 1) *
                                  this.state.itemperpage +
                                  tableindex
                                  ]
                                  ]
                                }
                                onClick={(e) =>
                                  this.OnChangeCondition_status(
                                    editjson[
                                    (this.state.pageclick - 1) *
                                    this.state.itemperpage +
                                    tableindex
                                    ],
                                    e
                                  )
                                }
                                name="line"
                                checked={tabledata.condition_status % 3 == 2}
                                type={type}
                                id={`inline-${type}-2`}
                              />
                            </Form.Group>
                          </div>
                        ))}
                      </Form>
                    </td>
                    <td>
                      <Button
                        type="primary"
                        disabled={
                          !this.state.editlist[
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                          ]
                        }
                        onClick={() =>
                          this.handleOpen(
                            editjson[
                            (this.state.pageclick - 1) *
                            this.state.itemperpage +
                            tableindex
                            ]
                          )
                        }
                      >
                        กำหนดเงื่อนไข
                        </Button>
                    </td>
                    <td>
                      <Button
                        variant="light"
                        className="editdata"
                        hidden={
                          this.state.editlist[
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                          ]
                        }
                        onClick={() =>
                          this.enableEdit(
                            editjson[
                            (this.state.pageclick - 1) *
                            this.state.itemperpage +
                            tableindex
                            ]
                          )
                        }
                      >
                        <img src={editbt} className="editicon" alt="edit" />
                      </Button>

                      <Button
                        hidden={
                          !this.state.editlist[
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                          ]
                        }
                        variant="link"
                        onClick={() =>
                          this.cancelEdit(
                            editjson[
                            (this.state.pageclick - 1) *
                            this.state.itemperpage +
                            tableindex
                            ]
                          )
                        }
                      >
                        ยกเลิก
                        </Button>

                      <Button
                        hidden={
                          !this.state.editlist[
                          editjson[
                          (this.state.pageclick - 1) *
                          this.state.itemperpage +
                          tableindex
                          ]
                          ]
                        }
                        variant="primary"
                        onClick={() =>
                          this.condition_confirm(
                            editjson[
                            (this.state.pageclick - 1) *
                            this.state.itemperpage +
                            tableindex
                            ]
                          )
                        }
                      >
                        ยืนยัน
                        </Button>
                    </td>
                    <td>
                      <Button variant="light" className="deletedata" onClick={() => this.deletebt(tabledata.person_id)}>
                        <img
                          src={deletebt}
                          className="deleteicon"
                          alt="delete"
                        />
                      </Button>
                    </td>
                  </tr>
                );
            }
          }
        }
      });
    // console.log(editjson);
    datalength = editjson.length;
    // var listdata = []
    var datedata = this.state.daylist.map((data, indexdata) => {
      var listdata = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var month = (element.getMonth() + 1)
        var day = element.getDate()
        var year = element.getFullYear()
        listdata.push(<td colspan="2">{day.toString().padStart(2, 0) + '/' + month.toString().padStart(2, 0) + '/' + year}</td>)
      }
      return listdata
      // console.log(data)
      // var month = (data.getMonth() + 1)
      // var day = data.getDate()
      // var year = data.getFullYear()
      // return  (<td colspan="2">{ day.toString().padStart(2,0) + '/' +  month.toString().padStart(2,0) + '/' + year}</td>)
    })

    return (
      <div className="page-container">
        <div className="content-wrap">
          <Nav />
          <h1 class="state">ข้อมูลบุคลากรในคณะ</h1>
          <div id="detail">
            <div className="filter">
              <h5 className="yearDLfil">บุคลากร</h5>
              <select
                className="selectyearDL"
                onChange={(e) => this.searchType(e)}
              >
                <option value="1">อาจารย์</option>
                <option value="2">เจ้าหน้าที</option>
              </select>

              <h5 className="yearDLfil" hidden={this.state.Typesearch % 2}>
                สำนักงาน
              </h5>
              <select
                className="selectyearDL"
                hidden={this.state.Typesearch % 2}
                onChange={(e) => this.searchOfficeType(e)}
              >
                <option value="1" selected = {this.state.office_type_search=='1'}> ภาควิชา </option>
                <option value="2" selected = {this.state.office_type_search=='2'} > สำนักงานคณบดี </option>
              </select>

              <h5
                className="yearDLfil"
                hidden={
                  !(this.state.Typesearch == 1) && this.state.office_type == 2
                }
              >
                ภาควิชา
              </h5>
              <select
                className="selectDept"
                hidden={
                  !(this.state.Typesearch == 1) && this.state.office_type == 2
                }
                onChange={(e) => this.searchDept(e)}
              >
                {this.state.dept.map((data) => {
                  if (data.Office_type == 1) {
                    if (this.state.deptid == data.Office_id) {
                      return (
                        <option selected value={data.Office_id}>{data.Office_name}</option>
                      )
                    } else {
                      return (
                        <option value={data.Office_id}>{data.Office_name}</option>
                      )
                    }

                  }
                })}
              </select>
            </div>
            <Table striped responsive className="Crtable">
              <thead>
                <tr className="">
                  <th>รหัสบุคลากร</th>
                  <th>คำนำหน้า</th>
                  <th>ชื่อ</th>
                  <th>นามสกุล</th>
                  <th>{typestring[this.state.Typesearch - 1]}</th>
                  <th>คุมสอบ</th>
                  <th>เงื่อนไข</th>
                  <th>แก้ไขข้อมูล</th>
                  <th>ลบข้อมูล</th>
                </tr>
              </thead>
              <tbody>{tabledata}</tbody>
              {this.state.rows}
            </Table>
            <Button variant="light" className="adddata" onClick={() => this.addrow()}>
              <img src={addbt} className="addicon" alt="add" />
            </Button>
            <Pagination
              activePage={this.state.pageclick}
              itemsCountPerPage={this.state.itemperpage}
              totalItemsCount={datalength}
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
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <button type="button" onClick={this.handleClose} class="close">
              <span aria-hidden="true">×</span>
              <span class="sr-only">Close</span>
            </button>
            {this.state.t_condition.map((data, index) => {
              if (this.state.condition_index == index) {

                return (
                  <div>
                    <div className="filter">
                      <h5 className="yearDLfil">
                        {data.Prename +
                          " " +
                          data.Firstname +
                          " " +
                          data.Lastname}
                      </h5>
                    </div>

                    {/* <div className="filter">
                      <h5 className="yearDLfil">เงื่อนไขอาคาร</h5>
                      <select
                        className="selectbuilding"
                        onChange={(e) =>
                          this.OnChangeBuilding_no(
                            this.state.condition_index,
                            e
                          )
                        }
                      >
                        <option value="ไม่มีเงื่อนไข" selecteds>
                          ไม่มีเงื่อนไข
                        </option>
                        {this.state.t_examroombuilding.map(
                          (selectdata, index) => {
                            if (data.building_no == selectdata.building_no) {
                              return (
                                <option selected value={selectdata.building_no}>
                                  {selectdata.building_no}
                                </option>
                              );
                            } else {
                              return (
                                <option value={selectdata.building_no}>
                                  {selectdata.building_no}
                                </option>
                              );
                            }
                          }
                        )}
                      </select>
                    </div> */}
                    <div className="filter">
                      <h5 className="yearDLfil">คุมสอบวิชาตัวเอง</h5>
                      <Form>
                        {["radio"].map((type) => (
                          <div key={`inline-${type}`}>
                            <Form.Group>
                              <Form.Check
                                inline
                                label="ไม่คุม"
                                name="line"
                                value="0"
                                checked={data.own_subject % 2 == 0}
                                type={type}
                                id={`inline-${type}-1`}
                                onClick={(e) =>
                                  this.OnChangeOwn_subject(
                                    this.state.condition_index,
                                    e
                                  )
                                }
                              />
                              <Form.Check
                                inline
                                label="คุม"
                                name="line"
                                value="1"
                                checked={data.own_subject % 2 == 1}
                                type={type}
                                id={`inline-${type}-2`}
                                onClick={(e) =>
                                  this.OnChangeOwn_subject(
                                    this.state.condition_index,
                                    e
                                  )
                                }
                              />
                            </Form.Group>
                          </div>
                        ))}
                      </Form>
                    </div>

                    <div className="filter">
                      <h5 className="yearDLfil">เงื่อนไขสัปดาห์</h5>
                      <select
                        className="selectweek"
                        onChange={(e) =>
                          this.OnChangeCondition_week(
                            this.state.condition_index,
                            e
                          )
                        }
                      >
                        <option value="0">ไม่มีเงื่อนไข</option>
                        <option value="1">สัปดาห์ที่ 1</option>
                        <option value="2">สัปดาห์ที่ 2</option>
                        <option value="3">สัปดาห์ที่ 3</option>
                        <option value="4">สัปดาห์ที่ 4</option>
                      </select>
                    </div>

                    <div className="filter">
                      <h5 className="yearDLfil">เงื่อนไขช่วงเวลา</h5>
                      <Form>
                        {["radio"].map((type) => (
                          <div key={`inline-${type}`}>
                            <Form.Group>
                              <Form.Check
                                inline
                                label="เช้า"
                                name="line"
                                value="0"
                                checked={data.condition_time % 4 == 0}
                                onClick={(e) =>
                                  this.OnChangeCondition_time(
                                    this.state.condition_index,
                                    e
                                  )
                                }
                                type={type}
                                id={`inline-${type}-1`}
                              />

                              <Form.Check
                                inline
                                label="บ่าย"
                                name="line"
                                checked={data.condition_time % 4 == 1}
                                value="1"
                                onClick={(e) =>
                                  this.OnChangeCondition_time(
                                    this.state.condition_index,
                                    e
                                  )
                                }
                                type={type}
                                id={`inline-${type}-1`}
                              />
                              <Form.Check
                                inline
                                label="เช้าและบ่ายในวันเดียวกัน"
                                value="2"
                                checked={data.condition_time % 4 == 2}
                                onClick={(e) =>
                                  this.OnChangeCondition_time(
                                    this.state.condition_index,
                                    e
                                  )
                                }
                                name="line"
                                type={type}
                                id={`inline-${type}-2`}
                              />
                              <Form.Check
                                inline
                                label="ไม่มีเงื่อนไข"
                                value="3"
                                checked={data.condition_time % 4 == 3}
                                onClick={(e) =>
                                  this.OnChangeCondition_time(
                                    this.state.condition_index,
                                    e
                                  )
                                }
                                name="line"
                                type={type}
                                id={`inline-${type}-2`}
                              />
                            </Form.Group>
                          </div>
                        ))}
                      </Form>
                    </div>

                    <div className="filter">
                      <h5 className="yearDLfil">คุมสอบเสาร์อาทิตย์</h5>
                      <Form>
                        {["radio"].map((type) => (
                          <div key={`inline-${type}`}>
                            <Form.Group>
                              <Form.Check
                                inline
                                label="ไม่คุม"
                                name="line"
                                value="0"
                                checked={data.condition_weekend % 3 == 0}
                                onClick={(e) =>
                                  this.OnChangeCondition_weekend(
                                    this.state.condition_index,
                                    e
                                  )
                                }
                                type={type}
                                id={`inline-${type}-1`}
                              />
                              <Form.Check
                                inline
                                label="คุม"
                                name="line"
                                value="1"
                                checked={data.condition_weekend % 2 == 1}
                                onClick={(e) =>
                                  this.OnChangeCondition_weekend(
                                    this.state.condition_index,
                                    e
                                  )
                                }
                                type={type}
                                id={`inline-${type}-2`}
                              />
                            </Form.Group>
                          </div>
                        ))}
                      </Form>
                      <br></br>
                    </div>
                    <div className="filter">
                      <h5 className="yearDLfil">ตารางเวลา</h5>
                    </div>
                    <Table striped responsive className="conditionTB">
                      <thead>
                        <tr className="">
                          <th colspan="2">จันทร์</th>
                          <th colspan="2">อังคาร</th>
                          <th colspan="2">พุธ</th>
                          <th colspan="2">พฤหัสบดี</th>
                          <th colspan="2">ศุกร์</th>
                          <th colspan="2">เสาร์</th>
                          <th colspan="2">อาทิตย์</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {datedata[0]}
                        </tr>
                        <tr>
                          <td className="monweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={!this.state.freetime_week1.includes('2x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '2x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={2}
                                label=""
                                checked={!this.state.freetime_week1.includes('2x2')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '2x2')}
                              />
                            </Form>
                          </td>

                          <td className="tueweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={3}
                                label=""
                                checked={!this.state.freetime_week1.includes('3x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '3x1')}

                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={4}
                                label=""
                                checked={!this.state.freetime_week1.includes('3x2')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '3x2')}
                              />
                            </Form>
                          </td>

                          <td className="wedweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={5}
                                label=""
                                checked={!this.state.freetime_week1.includes('4x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '4x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={6}
                                label=""
                                checked={!this.state.freetime_week1.includes('4x2')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '4x2')}
                              />
                            </Form>
                          </td>

                          <td className="thuweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={7}
                                label=""
                                checked={!this.state.freetime_week1.includes('5x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '5x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={8}
                                label=""
                                checked={!this.state.freetime_week1.includes('5x2')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '5x2')}
                              />
                            </Form>
                          </td>

                          <td className="friweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={9}
                                label=""
                                checked={!this.state.freetime_week1.includes('6x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '6x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={10}
                                label=""
                                checked={!this.state.freetime_week1.includes('6x2')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '6x2')}
                              />
                            </Form>
                          </td>

                          <td className="satweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={11}
                                label=""
                                checked={!this.state.freetime_week1.includes('7x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '7x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={12}
                                label=""
                                checked={!this.state.freetime_week1.includes('7x2')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '7x2')}
                              />
                            </Form>
                          </td>

                          <td className="sunweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={13}
                                label=""
                                checked={!this.state.freetime_week1.includes('1x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '1x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={14}
                                label=""
                                checked={!this.state.freetime_week1.includes('1x2')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '1x2')}
                              />
                            </Form>
                          </td>
                        </tr>
                        <tr hidden={this.state.daylist[1].length == 0} >
                          {datedata[1]}
                        </tr>
                        <tr hidden={this.state.daylist[1].length == 0} >
                          <td className="monweek2">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={15}
                                label=""
                                checked={!this.state.freetime_week2.includes('2x1')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '2x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={16}
                                label=""
                                checked={!this.state.freetime_week2.includes('2x2')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '2x2')}
                              />
                            </Form>
                          </td>

                          <td className="tueweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={17}
                                label=""
                                checked={!this.state.freetime_week1.includes('3x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '3x1')}

                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={18}
                                label=""
                                checked={!this.state.freetime_week2.includes('3x2')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '3x2')}
                              />
                            </Form>
                          </td>

                          <td className="wedweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={19}
                                label=""
                                checked={!this.state.freetime_week2.includes('4x1')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '4x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={20}
                                label=""
                                checked={!this.state.freetime_week2.includes('4x2')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '4x2')}
                              />
                            </Form>
                          </td>

                          <td className="thuweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={21}
                                label=""
                                checked={!this.state.freetime_week2.includes('5x1')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '5x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={22}
                                label=""
                                checked={!this.state.freetime_week2.includes('5x2')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '5x2')}
                              />
                            </Form>
                          </td>

                          <td className="friweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={23}
                                label=""
                                checked={!this.state.freetime_week2.includes('6x1')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '6x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={24}
                                label=""
                                checked={!this.state.freetime_week2.includes('6x2')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '6x2')}
                              />
                            </Form>
                          </td>

                          <td className="satweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={25}
                                label=""
                                checked={!this.state.freetime_week1.includes('7x1')}
                                onClick={(e) => this.handleChangeWeek_1_toggle(e, '7x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={26}
                                label=""
                                checked={!this.state.freetime_week2.includes('7x2')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '7x2')}
                              />
                            </Form>
                          </td>

                          <td className="sunweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={27}
                                label=""
                                checked={!this.state.freetime_week2.includes('1x1')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '1x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={28}
                                label=""
                                checked={!this.state.freetime_week2.includes('1x2')}
                                onClick={(e) => this.handleChangeWeek_2_toggle(e, '1x2')}
                              />
                            </Form>
                          </td>
                        </tr>

                        <tr hidden={this.state.daylist[2].length == 0} >
                          {datedata[2]}
                        </tr>
                        <tr hidden={this.state.daylist[2].length == 0} >
                          <td className="monweek2">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={29}
                                label=""
                                checked={!this.state.freetime_week3.includes('2x1')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '2x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={30}
                                label=""
                                checked={!this.state.freetime_week3.includes('2x2')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '2x2')}
                              />
                            </Form>
                          </td>

                          <td className="tueweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={31}
                                label=""
                                checked={!this.state.freetime_week3.includes('3x1')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '3x1')}

                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={32}
                                label=""
                                checked={!this.state.freetime_week3.includes('3x2')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '3x2')}
                              />
                            </Form>
                          </td>

                          <td className="wedweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={33}
                                label=""
                                checked={!this.state.freetime_week3.includes('4x1')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '4x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={34}
                                label=""
                                checked={!this.state.freetime_week3.includes('4x2')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '4x2')}
                              />
                            </Form>
                          </td>

                          <td className="thuweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={35}
                                label=""
                                checked={!this.state.freetime_week3.includes('5x1')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '5x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={36}
                                label=""
                                checked={!this.state.freetime_week3.includes('5x2')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '5x2')}
                              />
                            </Form>
                          </td>

                          <td className="friweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={37}
                                label=""
                                checked={!this.state.freetime_week3.includes('6x1')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '6x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={38}
                                label=""
                                checked={!this.state.freetime_week3.includes('6x2')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '6x2')}
                              />
                            </Form>
                          </td>

                          <td className="satweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={39}
                                label=""
                                checked={!this.state.freetime_week3.includes('7x1')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '7x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={40}
                                label=""
                                checked={!this.state.freetime_week3.includes('7x2')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '7x2')}
                              />
                            </Form>
                          </td>

                          <td className="sunweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={41}
                                label=""
                                checked={!this.state.freetime_week3.includes('1x1')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '1x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={42}
                                label=""
                                checked={!this.state.freetime_week3.includes('1x2')}
                                onClick={(e) => this.handleChangeWeek_3_toggle(e, '1x2')}
                              />
                            </Form>
                          </td>
                        </tr>

                        <tr hidden={this.state.daylist[3].length == 0} >
                          {datedata[3]}
                        </tr>
                        <tr hidden={this.state.daylist[3].length == 0} >
                          <td className="monweek2">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={43}
                                label=""
                                checked={!this.state.freetime_week4.includes('2x1')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '2x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={44}
                                label=""
                                checked={!this.state.freetime_week4.includes('2x2')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '2x2')}
                              />
                            </Form>
                          </td>

                          <td className="tueweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={45}
                                label=""
                                checked={!this.state.freetime_week4.includes('3x1')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '3x1')}

                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={46}
                                label=""
                                checked={!this.state.freetime_week4.includes('3x2')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '3x2')}
                              />
                            </Form>
                          </td>

                          <td className="wedweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={47}
                                label=""
                                checked={!this.state.freetime_week4.includes('4x1')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '4x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={48}
                                label=""
                                checked={!this.state.freetime_week4.includes('4x2')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '4x2')}
                              />
                            </Form>
                          </td>

                          <td className="thuweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={49}
                                label=""
                                checked={!this.state.freetime_week4.includes('5x1')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '5x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={50}
                                label=""
                                checked={!this.state.freetime_week4.includes('5x2')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '5x2')}
                              />
                            </Form>
                          </td>

                          <td className="friweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={51}
                                label=""
                                checked={!this.state.freetime_week4.includes('6x1')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '6x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={52}
                                label=""
                                checked={!this.state.freetime_week4.includes('6x2')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '6x2')}
                              />
                            </Form>
                          </td>

                          <td className="satweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={53}
                                label=""
                                checked={!this.state.freetime_week4.includes('7x1')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '7x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={54}
                                label=""
                                checked={!this.state.freetime_week4.includes('7x2')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '7x2')}
                              />
                            </Form>
                          </td>

                          <td className="sunweek1">
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={55}
                                label=""
                                checked={!this.state.freetime_week4.includes('1x1')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '1x1')}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={56}
                                label=""
                                checked={!this.state.freetime_week4.includes('1x2')}
                                onClick={(e) => this.handleChangeWeek_4_toggle(e, '1x2')}
                              />
                            </Form>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <Button
                      className="right"
                      type="primary"
                      onClick={() =>
                        this.condition_confirm(this.state.condition_index)
                      }
                    >
                      ยืนยันข้อมูล
                    </Button>
                  </div>
                );
              }
            })}
          </Modal.Body>
        </Modal>
        <Modal show={this.state.showdl} onHide={this.handleClosedl}>
          <Modal.Header closeButton>
            <Modal.Title>คำเตือน</Modal.Title>
          </Modal.Header>
          <Modal.Body>คุณแน่ใจหรือไม่ที่จะต้องการลบข้อมูลนี้</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClosedl}>
              ยกเลิก
                        </Button>
            <Button variant="primary" onClick={this.confirmdelete}>
              ยืนยัน
                        </Button>
          </Modal.Footer>
        </Modal>

        <Modal size="sm" show={this.state.showsubmit} onHide={this.handleClosesubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>ลบข้อมูลสำเร็จ</Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>

        <Modal size="sm" show={this.state.showfailed} onHide={this.handleClosefailed}>
          <Modal.Header closeButton>
            <Modal.Title>Failed</Modal.Title>
          </Modal.Header>
          <Modal.Body>ลบข้อมูลล้มเหลว</Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>


      </div>

    );
  }
}
