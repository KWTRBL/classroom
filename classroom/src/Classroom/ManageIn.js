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
      persontype: null,
      firstitem: 0,
      lastitem: null,
      pageclick: 1,
      itemperpage: 10,
      editlist: [],
      olddata: [],
    };
  }
  componentWillMount() {
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

    this.setState({
      firstitem: 0,
      lastitem: this.state.itemperpage,
    });
  }


  pageselect(pageNumber) {
    let newId = this.state.editlist.slice()
    for (var i = 0; i < newId.length; i++) {
        if (newId[i] == 1) {
            newId[i] = 0
        }
    }
    this.setState({
        pageclick: pageNumber,
        firstitem: (this.state.itemperpage * pageNumber) - this.state.itemperpage,
        lastitem: (this.state.itemperpage * pageNumber),
        editlist: newId,
        exam_committee: JSON.parse(this.state.olddata),

    })
}


  render() {

    //
    var tabledata = this.state.exam_committee
      .filter((data, index) => {
        return data;
      })
      .slice(this.state.firstitem, this.state.lastitem)
      .map((tabledata, tableindex) => {});



    return (
      <div className="page-container">
        <div className="content-wrap">
          <Nav />
          <h1 class="state">จัดกรรมการคุมสอบ</h1>
          <div id="detail">
            <div className="filter">
              <h5 className="yearDLfil">ปีการศึกษา</h5>
              <select className="selectyearDL">
                <option value="13:00">2563</option>
              </select>
              <h5 className="termDLfil">ภาคการศึกษา</h5>
              <select className="selecttermDL">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <h5 className="termDLfil">การสอบ</h5>
              <select className="selectime">
                <option value="7:00">กลางภาค</option>
                <option value="13:00">ปลายภาค</option>
              </select>
            </div>
            <div className="filter">
              <h5 className="departManfil2">ภาควิชา</h5>
              <select className="selectdepart">
                <option value="13:00">วิศวกรรมคอมพิวเตอร์</option>
              </select>

              <h5 className="termDLfil">กรรมการ</h5>
              <select className="selecttermDL">
                <option value="13:00">อาจารย์</option>
              </select>
              <div id="ManageInbtn">
                <Button variant="primary" className="ManageInbtn">
                  จัดคุมวิชาที่สอน
                </Button>
              </div>
              <div id="">
                <Button variant="primary" className="ManageInbtn">
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
                <tr>
                  <td> ผศ.ดร. ปกรณ์ วัฒนจตุรพร</td>
                  <td>
                    ส 7 มีค.63 09:30-12:30 อาคาร 12 ชั้น ห้อง E12-410
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td> ผศ.ดร. ชมพูนุท จินจาคาม</td>
                  <td>
                    จ 2 มีค.63 09:30-12:30 อาคาร 12 ชั้น ห้อง E12-409
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td>
                    พฤ 5 มีค.63 09:30-12:30 อาคาร 12 ชั้น ห้อง E12-410
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td>
                    ศ 6 มีค.63 09:30-12:30 อาคาร 12 ชั้น ห้อง E12-302
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td> ผศ. ธนา หงษ์สุวรรณ</td>
                  <td>
                    อ 3 มีค.63 13:30-16:30 อาคาร HM ห้อง HM-405
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td>
                    พฤ 5 มีค.63 13:30-16:30 อาคาร 12 ชั้น ห้อง E12-503
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td>
                    ศ 6 มีค.63 09:30-12:30 อาคาร HM ห้อง HM-501
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td> รศ.ดร. เกียรติกูล เจียรนัยธนะกิจ</td>
                  <td>
                    อ 3 มีค.63 13:30-16:30 อาคารเครื่องกล ห้อง ME-408
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td>
                    พ 4 มีค.63 09:30-12:30 อาคาร HM ห้อง HM-301
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td>
                    พ 4 มีค.63 13:30-16:30 อาคาร 12 ชั้น ห้อง E12-502
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>อ. เกียรติณรงค์ ทองประเสริฐ</td>
                  <td>
                    อ 3 มีค.63 13:30-16:30 อาคารเครื่องกล ห้อง ME-402
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td>
                    พฤ 5 มีค.63 09:30-12:30 อาคาร 12 ชั้น ห้อง E12-405
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td>
                    พฤ 5 มีค.63 13:30-16:30 อาคาร 12 ชั้น ห้อง E12-501
                    <Button variant="light" className="editIndata">
                      <img src={editbt} className="editInicon" alt="edit" />
                    </Button>
                    <Button variant="light" className="deleteIndata">
                      <img
                        src={deletebt}
                        className="deleteInicon"
                        alt="delete"
                      />
                    </Button>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>รศ.ดร.อรฉัตร จิตต์โสภักตร์</td>
                  <td>
                    <p>
                      <br></br>
                      <br></br>
                    </p>
                  </td>
                  <td>
                    <p>
                      <br></br>
                      <br></br>
                    </p>
                  </td>
                  <td>
                    <p>
                      <br></br>
                      <br></br>
                    </p>
                  </td>
                  <td>
                    <p>
                      <br></br>
                      <br></br>
                    </p>
                  </td>
                  <td>
                    <p>
                      <br></br>
                      <br></br>
                    </p>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <div className="footer">
          <Foot />
        </div>
      </div>
    );
  }
}
