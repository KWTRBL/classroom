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
import axios from "axios";
import Pagination from "react-js-pagination";
import Modal from 'react-bootstrap/Modal'


import "./ManageIn.css";
export default class ManageIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exam_committee: [],
      yearsearch: null,
      semestersearch: null,
      mid_or_final: null,
      departsearch: null,
      deptlist: [],
      persontype: null,
      personfilter: [],
      firstitem: 0,
      lastitem: null,
      pageclick: 1,
      itemperpage: 10,
      editlist: [],
      olddata: [],
      filter: [],
      buildingdata: [],
      show: false,
      deldata: null,
      ownsubjecthide: true,
      normalsubjecthide: true,
      buttonstatedata: []
    };

    this.pageselect = this.pageselect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.remove = this.remove.bind(this);

  }
  componentWillMount() {
    axios
      .get("http://localhost:7777/exam_committee")
      .then((res) => {
        // console.log(res.data);
        var datain = JSON.stringify(res.data[0].list);
        var jsondata = JSON.parse(res.data[0].list);
        // console.log(res.data[0].list[91],res.data[0].list[92])
        // console.log(typeof res.data[0].list,typeof jsondata,jsondata)
        const newIds = this.state.editlist.slice();
        for (var i = 0; i < res.data.length; i++) {
          newIds.push(0);
        }
        this.setState({
          editlist: newIds,
          olddata: JSON.stringify(res.data),
          exam_committee: res.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
      
    axios
      .get("http://localhost:7777/exam_committee")
      .then((res) => {
        // console.log(res.data);
        var datain = JSON.stringify(res.data[0].list);
        var jsondata = JSON.parse(res.data[0].list);
        // console.log(res.data[0].list[91],res.data[0].list[92])
        // console.log(typeof res.data[0].list,typeof jsondata,jsondata)
        const newIds = this.state.editlist.slice();
        for (var i = 0; i < res.data.length; i++) {
          newIds.push(0);
        }
        this.setState({
          editlist: newIds,
          olddata: JSON.stringify(res.data),
          exam_committee: res.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });


    axios
      .get("http://localhost:7777/exam_committee_filter")
      .then((res) => {
        var data = JSON.parse(res.data[0].filter);
        // console.log(JSON.parse(res.data[0].filter));
        this.setState({
          filter: res.data,
          yearsearch: res.data[0].year,
          semestersearch: data[0].semester,
          mid_or_final: data[0].mid_or_final,
          persontype: 1
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:7777/t_office")
      .then((res) => {
        this.setState({
          deptlist: res.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://localhost:7777/personfilter")
      .then((res) => {

        this.setState({
          departsearch: res.data[0].Office_id,
          personfilter: res.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get("http://localhost:7777/exam_committee_check")
      .then((res) => {


        this.setState({
          buttonstatedata: res.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get("http://localhost:7777/building")
      .then((res) => {
        this.setState({
          buildingdata: res.data
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


  change_year = (e) => {
    var value = e.target.value
    this.state.filter.map((data, index) => {
      if (value == data.year) {
        var filterjson = JSON.parse(data.filter);
        console.log(data)
        console.log(filterjson[0].semester, filterjson[0].mid_or_final)
        this.setState({
          yearsearch: value,
          semestersearch: filterjson[0].semester,
          mid_or_final: filterjson[0].mid_or_final,
          persontype: 1,
          departsearch: '01'
        })
      }
    })

    // console.log(value)
  }

  change_persontype = (e, id) => {
    var value = e.target.value
    var data = this.state.firstdept
    this.setState({
      persontype: value,
      departsearch: '01'
    })
  }

  change_depart = (e) => {
    var value = e.target.value
    this.setState({
      departsearch: value
    })
  }

  change_mid_or_final = (e) => {
    var value = e.target.value
    this.setState({
      mid_or_final: value
    })
  }
  change_semester = (e) => {
    var value = e.target.value
    this.setState({
      semestersearch: value,
      mid_or_final: 'M'
    })
  }

  pageselect(pageNumber) {
    let newId = this.state.editlist.slice();
    for (var i = 0; i < newId.length; i++) {
      if (newId[i] == 1) {
        newId[i] = 0;
      }
    }
    this.setState({
      pageclick: pageNumber,
      firstitem: this.state.itemperpage * pageNumber - this.state.itemperpage,
      lastitem: this.state.itemperpage * pageNumber,
      editlist: newId,
      exam_committee: JSON.parse(this.state.olddata),
    });
  }


  deletebt = (data) => {
    this.setState({
      show: true,
      deldata: data
    })
  }

  remove() {
    var value = this.state.deldata
    axios.delete('http://localhost:7777/exam_committee/delete',
      {
        data: {
          person_id: value.person_id,
          year: this.state.yearsearch,
          semester: this.state.semestersearch,
          mid_or_final: this.state.mid_or_final,
          exam_date: value.exam_date,
          exam_time: value.exam_time
        }
      }
    ).then(response => {
      console.log(response)
      this.handleClose()
      axios
      .get("http://localhost:7777/exam_committee")
      .then((res) => {
        // console.log(res.data);
        var datain = JSON.stringify(res.data[0].list);
        var jsondata = JSON.parse(res.data[0].list);
        // console.log(res.data[0].list[91],res.data[0].list[92])
        // console.log(typeof res.data[0].list,typeof jsondata,jsondata)
        const newIds = []
        for (var i = 0; i < res.data.length; i++) {
          newIds.push(0);
        }
        this.setState({
          editlist: newIds,
          olddata: JSON.stringify(res.data),
          exam_committee: res.data,
          show:false
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

  adddata(value) {
    console.log(value)
    axios.post('http://localhost:7777/exam_committee/adddata',
      {

        person_id: value,
        year: this.state.yearsearch,
        semester: this.state.semestersearch,
        mid_or_final: this.state.mid_or_final,
        faculty_id: this.state.departsearch

      }
    ).then((res) => {
      console.log(res.data)
          axios
      .get("http://localhost:7777/exam_committee")
      .then((res) => {
        // console.log(res.data);
        var datain = JSON.stringify(res.data[0].list);
        var jsondata = JSON.parse(res.data[0].list);
        // console.log(res.data[0].list[91],res.data[0].list[92])
        // console.log(typeof res.data[0].list,typeof jsondata,jsondata)
        const newIds = this.state.editlist.slice();
        for (var i = 0; i < res.data.length; i++) {
          newIds.push(0);
        }
        this.setState({
          editlist: newIds,
          olddata: JSON.stringify(res.data),
          exam_committee: res.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });


      // window.location.reload(false);

    })
    .catch(function (error) {
      console.log(error);
    });

  }

  ownsubject_exam() {
    axios.post('http://localhost:7777/exam_schedule',
      {
        year: this.state.yearsearch,
        semester: this.state.semestersearch,
        mid_or_final: this.state.mid_or_final,
        faculty_id: this.state.departsearch
      }
    ).then((res) => {
      console.log(res.data)
      axios
        .get("http://localhost:7777/exam_committee")
        .then((res) => {
          const newIds = this.state.editlist.slice();
          for (var i = 0; i < res.data.length; i++) {
            newIds.push(0);
          }
          this.setState({
            editlist: newIds,
            olddata: JSON.stringify(res.data),
            exam_committee: res.data,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      axios
        .get("http://localhost:7777/exam_committee_check")
        .then((res) => {

          this.setState({
            buttonstatedata: res.data
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    )
    // window.location.reload(false);

  }

  normalsubject() {
    if (this.state.persontype == 1) {
      axios.post('http://localhost:7777/exam_schedule_other',
        {
          year: this.state.yearsearch,
          semester: this.state.semestersearch,
          mid_or_final: this.state.mid_or_final,
          faculty_id: this.state.departsearch
        }
      ).then((res) => {

        axios
        .get("http://localhost:7777/exam_committee")
        .then((res) => {
          const newIds = this.state.editlist.slice();
          for (var i = 0; i < res.data.length; i++) {
            newIds.push(0);
          }
          this.setState({
            editlist: newIds,
            olddata: JSON.stringify(res.data),
            exam_committee: res.data,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      axios
        .get("http://localhost:7777/exam_committee_check")
        .then((res) => {

          this.setState({
            buttonstatedata: res.data
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    
      })
    }
    if (this.state.persontype == 2) {
      axios.post('http://localhost:7777/exam_committee_officer',
        {
          year: this.state.yearsearch,
          semester: this.state.semestersearch,
          mid_or_final: this.state.mid_or_final,
        }
      ).then((res)=>{

        axios
        .get("http://localhost:7777/exam_committee")
        .then((res) => {
          const newIds = this.state.editlist.slice();
          for (var i = 0; i < res.data.length; i++) {
            newIds.push(0);
          }
          this.setState({
            editlist: newIds,
            olddata: JSON.stringify(res.data),
            exam_committee: res.data,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      axios
        .get("http://localhost:7777/exam_committee_check")
        .then((res) => {

          this.setState({
            buttonstatedata: res.data
          });
        })
        .catch(function (error) {
          console.log(error);
        });

      })
    }

    // window.location.reload(false);


  }

  handleClose() {
    this.setState({
      show: false
    })
  }


  render() {
    var own_subjecthidden = false
    var normaldisable = false
    var own_subjectdisable = false
    if (this.state.persontype == 2) {
      own_subjecthidden = true
      own_subjectdisable = true
    }
    this.state.buttonstatedata.map((data, index) => {
      // console.log('data in ', this.state.yearsearch, this.state.semestersearch, this.state.mid_or_final, this.state.persontype, this.state.departsearch)
      // console.log(data.year, data.semester, data.mid_or_final, data.person_type, data.office_id)
      //
      if (data.year == this.state.yearsearch && data.semester == this.state.semestersearch && data.mid_or_final == this.state.mid_or_final && data.office_id == this.state.departsearch && data.person_type == this.state.persontype) {
        console.log(true)
        if (data.status == 1) {
          own_subjectdisable = true
        }
        if (data.status == 2) {
          normaldisable = true
        }
      }
      //เจอเจ้าหน้้าที่
      if(data.year == this.state.yearsearch && data.semester == this.state.semestersearch && data.mid_or_final == this.state.mid_or_final && data.office_id == '00' && this.state.persontype == 2){
        normaldisable = true
      }
    })

    if (own_subjectdisable == false) {
      normaldisable = true
    }

    var yeardata = this.state.filter.map((data, index) => {
      return <option value={data.year.toString()}>{data.year}</option>;
    });
    var mid_or_final = this.state.filter.map((data, index) => {
      // this.state.yearsearch
      if (data.year == this.state.yearsearch) {
        var filterjson = JSON.parse(data.filter);
        var listdata = [];
        return filterjson.map((jsondata, index) => {
          if (jsondata.semester == this.state.semestersearch) {
            if (!listdata.includes(jsondata.mid_or_final)) {
              listdata.push(jsondata.mid_or_final);
              return (
                <option value={jsondata.mid_or_final} >
                  {jsondata.mid_or_final == "M" ? "กลางภาค" : "ปลายภาค"}
                </option>
              );
            }
          }
        });
      }
    });

    var semester = this.state.filter.map((data, index) => {
      if (data.year == this.state.yearsearch) {
        var filterjson = JSON.parse(data.filter);
        var listdata = [];
        return filterjson.map((jsondata, index) => {
          if (!listdata.includes(jsondata.semester)) {
            listdata.push(jsondata.semester);
            return (
              <option selected={this.state.semestersearch == jsondata.semester ? true : false} value={jsondata.semester} > {jsondata.semester} </option>
            );
          }
        });
      }
    });

    var listdata = [];

    var person_type = this.state.personfilter.map((data, index) => {
      // console.log(listdata)
      if (!listdata.includes(data.Office_type)) {
        listdata.push(data.Office_type);
        // console.log('datatype ', (data.Office_type))

        return (
          <option value={data.Office_type} selected={data.Office_type == this.state.persontype ? true : false} >
            {data.Office_type == "1" ? "อาจารย์" : "เจ้าหน้าที่"}
          </option>

        )

      }
    })

    var count = 0
    var firstid = null
    var dept = this.state.personfilter.map((data, index) => {
      if (data.Office_type == this.state.persontype) {
        // console.log(this.state.personfilter.length)
        return (
          <option value={data.Office_id} >
            {data.Office_name}
          </option>
        )

      } else {
        if (count == 0) {
          firstid = data.Office_id
          count = 1;
        }
        if (this.state.persontype == 2) {
          return (
            <option value={data.Office_id} >
              {data.Office_name}
            </option>
          )

        }

      }

    })

    var editjson = []
    var tabledata = this.state.exam_committee.filter((member, index) => {
      if  ( (member.Office_id == this.state.departsearch && member.Person_type == this.state.persontype && this.state.persontype == 1 )|| (this.state.persontype == 2 && member.Person_type == this.state.persontype)) {
        editjson.push(index)
        // console.log(member)
        return member
      }
    }).slice(this.state.firstitem, this.state.lastitem).map((data, index) => {
      if ((data.Office_id == this.state.departsearch && data.Person_type == this.state.persontype && this.state.persontype == 1 )|| (this.state.persontype == 2 && data.Person_type == this.state.persontype)) {
        // console.log('index : ', index)
        var jsondata = JSON.parse(data.list)
        var examlist = []
        var result = []
        jsondata.map((datajson, index) => {
          if (datajson.year == this.state.yearsearch && datajson.semester == this.state.semestersearch && datajson.mid_or_final == this.state.mid_or_final) {
            // console.log(datajson)
            var date = new Date(datajson.exam_date)
            date.setFullYear(date.getFullYear() - 543)
            var strdate = date.toLocaleDateString('th-TH', {
              year: '2-digit',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })
            datajson['person_id'] = data.person_id
            examlist.push(datajson)
            result.push(strdate)

          }
        })
        return (
          <tr>
            <td>
              {data.name }
            </td>
            <td>
              <div className="flex-container">
                <div>
                  {
                    examlist.length != 0 ? (
                      result[0] + ' ' + (examlist[0].exam_time == 1 ? '09:30-12:30' : '13:30-16:30') 

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length != 0 ? (
                      examlist[0].building_no + ' ห้อง ' + examlist[0].room_no

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length != 0 ?
                      (
                        <Button variant="light" className="deleteIndata"   onClick={() => this.deletebt(examlist[0])}>
                          <img
                            src={deletebt}
                            className="deleteInicon"
                            alt="delete"

                          />
                        </Button>
                      ) : (
                        <Button variant="light" className="deleteIndata" onClick={() => this.adddata(data.person_id)}>
                          <img
                            src={addbt}
                            className="deleteInicon"
                            alt="delete" 
                            
                          />       
                        </Button>
                      )
                  }
                </div>
              </div>
            </td>


            <td>
              <div className="flex-container">
                <div>
                  {
                    examlist.length > 1 ? (
                      result[1] + ' ' + (examlist[1].exam_time == 1 ? '09:30-12:30' : '13:30-16:30') 

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length > 1 ? (
                      examlist[1].building_no + ' ห้อง ' + examlist[1].room_no

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length > 1 ?
                      (
                        <Button variant="light" className="deleteIndata"   onClick={() => this.deletebt(examlist[1])}>
                          <img
                            src={deletebt}
                            className="deleteInicon"
                            alt="delete"

                          />
                        </Button>
                      ) : (
                        <Button variant="light" className="deleteIndata" onClick={() => this.adddata(data.person_id)}>
                          <img
                            src={addbt}
                            className="deleteInicon"
                            alt="delete" 
                            
                          />       
                        </Button>
                      )
                  }
                </div>
              </div>
            </td>



            <td>
              <div className="flex-container">
                <div>
                  {
                    examlist.length > 2 ? (
                      result[2] + ' ' + (examlist[2].exam_time == 1 ? '09:30-12:30' : '13:30-16:30') 

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length > 2 ? (
                      examlist[2].building_no + ' ห้อง ' + examlist[2].room_no

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length > 2 ?
                      (
                        <Button variant="light" className="deleteIndata"   onClick={() => this.deletebt(examlist[2])}>
                          <img
                            src={deletebt}
                            className="deleteInicon"
                            alt="delete"

                          />
                        </Button>
                      ) : (
                        <Button variant="light" className="deleteIndata" onClick={() => this.adddata(data.person_id)}>
                          <img
                            src={addbt}
                            className="deleteInicon"
                            alt="delete" 
                            
                          />       
                        </Button>
                      )
                  }
                </div>
              </div>
            </td>


            <td>
              <div className="flex-container">
                <div>
                  {
                    examlist.length > 3 ? (
                      result[3] + ' ' + (examlist[3].exam_time == 1 ? '09:30-12:30' : '13:30-16:30') 

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length > 3 ? (
                      examlist[3].building_no + ' ห้อง ' + examlist[3].room_no

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length > 3 ?
                      (
                        <Button variant="light" className="deleteIndata"   onClick={() => this.deletebt(examlist[3])}>
                          <img
                            src={deletebt}
                            className="deleteInicon"
                            alt="delete"

                          />
                        </Button>
                      ) : (
                        <Button variant="light" className="deleteIndata" onClick={() => this.adddata(data.person_id)}>
                          <img
                            src={addbt}
                            className="deleteInicon"
                            alt="delete" 
                            
                          />       
                        </Button>
                      )
                  }
                </div>
              </div>
            </td>


            <td>
              <div className="flex-container">
                <div>
                  {
                    examlist.length > 4 ? (
                      result[4] + ' ' + (examlist[4].exam_time == 1 ? '09:30-12:30' : '13:30-16:30') 

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length > 4 ? (
                      examlist[4].building_no + ' ห้อง ' + examlist[4].room_no

                    ) : ''
                  }
                </div>
                <div>
                  {
                    examlist.length > 4 ?
                      (
                        <Button variant="light" className="deleteIndata"   onClick={() => this.deletebt(examlist[4])}>
                          <img
                            src={deletebt}
                            className="deleteInicon"
                            alt="delete"

                          />
                        </Button>
                      ) : (
                        <Button variant="light" className="deleteIndata" onClick={() => this.adddata(data.person_id)}>
                          <img
                            src={addbt}
                            className="deleteInicon"
                            alt="delete" 
                            
                          />       
                        </Button>
                      )
                  }
                </div>
              </div>
            </td>

          </tr>
        )
      }
    })
    // console.log(editjson)

    var data_num = this.state.exam_committee.filter((member, index) => {
      if ((member.Office_id == this.state.departsearch && member.Person_type == this.state.persontype && this.state.persontype == 1 )|| (this.state.persontype == 2 && member.Person_type == this.state.persontype)) {
        return member
      }
    }).length

    var deptselecthidden = false
    if(this.state.persontype == 2 ){
      deptselecthidden = true
    }

    return (
      <div className="page-container">
        <div className="content-wrap">
          <Nav />
          <h1 class="state">จัดกรรมการคุมสอบ</h1>
          <div id="detail">
            <div className="filter">
              <h5 className="yearDLfil">ปีการศึกษา</h5>
              <select className="selectyearDL" onChange={(e) => this.change_year(e)}>{yeardata}</select>
              <h5 className="termDLfil">ภาคการศึกษา</h5>
              <select className="selecttermDL" onChange={(e) => this.change_semester(e)}>
                {semester}
              </select>
              <h5 className="termDLfil">การสอบ</h5>
              <select className="selectime" onChange={(e) => this.change_mid_or_final(e)}>{mid_or_final}</select>
            </div>
            <div className="filter">
              <h5 className="termDLfil">กรรมการ</h5>
              <select className="selecttermDL" onChange={(e) => this.change_persontype(e, firstid)}>
                {person_type}
              </select>

              <h5 className="departManfil2" hidden = {deptselecthidden}>ภาควิชา</h5>
              <select className="selectdepart" hidden = { deptselecthidden} onChange={(e) => this.change_depart(e)}>
                {dept}
              </select>

              <div id="ManageInbtn">
                <Button variant="primary" hidden={own_subjecthidden} disabled={own_subjectdisable} onClick={() => this.ownsubject_exam()} className="ManageInbtn">
                  จัดคุมวิชาที่สอน
                </Button>
              </div>
              <div id="">
                <Button variant="primary" disabled={normaldisable} onClick={() => this.normalsubject()} className="ManageInbtn">
                  จัดคุมสอบปกติ
                </Button>
              </div>
            </div>
            <Table striped responsive className="ManageInTb">
              <thead>
                <tr className="ManageIntable">
                  <th>ชื่ออาจารย์ - เจ้าหน้าที่</th>
                  <th>คุมสอบครั้งที่ 1</th>
                  <th>คุมสอบครั้งที่ 2</th>
                  <th>คุมสอบครั้งที่ 3</th>
                  <th>คุมสอบครั้งที่ 4</th>
                  <th>คุมสอบครั้งที่ 5</th>
                </tr>
              </thead>
              <tbody>
                {tabledata}
              </tbody>
            </Table>
            <Pagination
              activePage={this.state.pageclick}
              itemsCountPerPage={this.state.itemperpage}
              totalItemsCount={data_num}
              itemClass="page-item"
              linkClass="page-link"
              pageRangeDisplayed={5}
              onChange={this.pageselect}

            />
          </div>
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>คำเตือน</Modal.Title>
          </Modal.Header>
          <Modal.Body>คุณแน่ใจหรือไม่ที่จะต้องการลบข้อมูลนี้</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              ยกเลิก
                        </Button>
            <Button variant="primary" onClick={this.remove}>
              ยืนยัน
                        </Button>
          </Modal.Footer>
        </Modal>
        <div className="footer">
          <Foot />
        </div>

      </div>
    );
  }
}
