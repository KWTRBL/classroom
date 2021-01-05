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
      person: [],
      condition_index: 0,
      t_examroombuilding: [],
      office_type: 1,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.searchDept = this.searchDept.bind(this);
    this.searchType = this.searchType.bind(this);
    this.enableEdit = this.enableEdit.bind(this);
    this.pageselectvalue = this.pageselectvalue.bind(this);
  }

  componentWillMount() {
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

        this.setState({
          t_condition: res.data,
          editlist: newIds,
          olddata: JSON.stringify(res.data),
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
      editlist: newId,
      teacher: JSON.parse(this.state.olddata),
    });
    this.pageselectvalue(1);
  };

  searchType = (event) => {
    console.log(!(this.state.Typesearch == 1) || this.state.Typesearch == 2);

    let newId = this.state.editlist.slice();
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0;
      }
    }
    let keyword = event.target.value;
    this.setState({
      office_type: 1,
      deptid:"01",
      Typesearch: parseInt(keyword),
      editlist: newId,
      teacher: JSON.parse(this.state.olddata),
    });
    this.pageselectvalue(1);
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
      deptid:"01",
      office_type: parseInt(keyword),
      editlist: newId,
      teacher: JSON.parse(this.state.olddata),
    });
    this.pageselectvalue(1);
  };
  handleOpen(index) {
    this.setState({
      condition_index: index,
      show: true,
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
    this.setState({ editlist: newIds }); //set the new state
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
        condition_status: this.state.t_condition[index].condition_status,
        person_id: this.state.t_condition[index].person_id,
        building_no: this.state.t_condition[index].building_no,
        own_subject: this.state.t_condition[index].own_subject,
        condition_week: this.state.t_condition[index].condition_week,
        condition_time: this.state.t_condition[index].condition_time,
        condition_weekend: this.state.t_condition[index].condition_weekend,
      })
      .then((response) => {
        console.log("response: ", response);
      })
      .catch((err) => {
        console.error(err);
      });
    window.location.reload(false);
  };

  render() {
    var editjson = [];
    var tabledata = [];
    var datalength = 0;
    var typestring = ["ตำแหน่ง", "สำนักงาน"];
    var person_type = ["อาจารย์", "เจ้าหน้าที่"];
    var type_search = this.state.Typesearch;

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
                  <td>{tabledata.Prename}</td>
                  <td>{tabledata.Firstname}</td>
                  <td>{tabledata.Lastname}</td>
                  <td>{tabledata.position}</td>
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
                    <Button variant="light" className="deletedata">
                      <img src={deletebt} className="deleteicon" alt="delete" />
                    </Button>
                  </td>
                </tr>
              );
            }
          } else {
            if (tabledata.Office_type == this.state.office_type) {
              if (
                tabledata.Office_type == 2 ||
                (this.state.deptid == tabledata.faculty_id &&
                  tabledata.Office_type == 1)
              )
                return (
                  <tr>
                    <td>{tabledata.person_id}</td>
                    <td>{tabledata.Prename}</td>
                    <td>{tabledata.Firstname}</td>
                    <td>{tabledata.Lastname}</td>
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
                      <Button variant="light" className="deletedata">
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
    console.log(editjson);
    datalength = editjson.length;

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
                <option value="1"> ภาควิชา </option>
                <option value="2"> สำนักงานคณบดี </option>
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
                  if(data.Office_type == 1){
                    if(this.state.deptid == data.Office_id){
                      return (
                        <option selected value={data.Office_id}>{data.Office_name}</option>
                      )
                    }else{
                      return (
                        <option  value={data.Office_id}>{data.Office_name}</option>
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
            </Table>
            <Button variant="light" className="adddata">
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

                    <div className="filter">
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
                    </div>
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
                          <td colspan="2">02/03/63</td>
                          <td colspan="2">03/03/63</td>
                          <td colspan="2">04/03/63</td>
                          <td colspan="2">05/03/63</td>
                          <td colspan="2">06/03/63</td>
                          <td colspan="2">07/03/63</td>
                          <td colspan="2">08/03/63</td>
                        </tr>
                        <tr>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">09/03/63</td>
                          <td colspan="2">10/03/63</td>
                          <td colspan="2">11/03/63</td>
                          <td colspan="2">12/03/63</td>
                          <td colspan="2">13/03/63</td>
                          <td colspan="2">14/03/63</td>
                          <td colspan="2">15/03/63</td>
                        </tr>
                        <tr>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
                              />
                            </Form>
                          </td>
                          <td>
                            เช้า
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={1}
                              />
                            </Form>
                          </td>
                          <td>
                            บ่าย
                            <br></br>
                            <Form>
                              <Form.Check
                                type="switch"
                                id={1}
                                label=""
                                checked={0}
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
      </div>
    );
  }
}
