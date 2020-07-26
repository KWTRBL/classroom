import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import Foot from '../Navbar/FooterCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import axios from 'axios';
import { Component } from 'react';
import { json } from 'body-parser';
import Pagination from 'react-bootstrap/Pagination'
import './ManageCr.css'

export default class BuildingData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            year: [],
            semester: [],
            curr2: [],
            stateyear: 0,
            yearsearch: null,
            semestersearch: null,
            curr2search: null,
            daysearch: null,
            result: [1, 2, 3],
            pageclick: 1,
            itemperpage: 10,
            firstitem: null,
            lastitem: null,
            starttime: '07:00',
            timeperiod: 0, //ช่วงเวลา

        }
        this.pageselect = this.pageselect.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);

        this.pageselectvalue = this.pageselectvalue.bind(this);

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
            firstitem: (this.state.itemperpage * parseInt(e.target.textContent)) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * parseInt(e.target.textContent))
        })
    }

    pageselectvalue(value) {
        this.setState({
            pageclick: parseInt(value),
            firstitem: (this.state.itemperpage * parseInt(value)) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * parseInt(value))
        })
    }
    searchYear = (event) => {
        let keyword = event.target.value;
        this.setState({
            yearsearch: keyword,
            stateyear: 0
        })
        this.pageselectvalue(1)
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
        this.pageselectvalue(1)
    }
    searchDay = (event) => {
        let keyword = event.target.value;
        this.setState({ daysearch: keyword })
        this.pageselectvalue(1)
    }

    searchTime = (event) => {
        let keyword = event.target.value;
        this.setState({ starttime: keyword })
        this.pageselectvalue(1)
    }

    manageroom = () => {
        axios
        .post("http://localhost:7777/manageroom", {
            data: {
                year: this.state.yearsearch,
                semester: this.state.semestersearch,
                curr2_id: this.state.curr2search,
                teach_day: this.state.daysearch,
                timeperiod: this.state.starttime
            }
        })
        .then(response => {
            console.log("response: ", response)

            // do something abosut response
        })
        .catch(err => {
            console.error(err)
        })
    window.location.reload(false);
    }


    render() {
        const item = this.state.name.filter((member) => {
            var teachtime = member.teach_time.split(/[- :]/);
            var searchtime = this.state.starttime.split(/[- :]/);

            if (this.state.yearsearch == null) {

                this.setState({ curr2search: "00", yearsearch: 2555, semestersearch: 1, daysearch: 1 })
                return member.curr2_id == "00" && member.year == 2555 && member.semester == 1 && member.teach_day == 1 && (parseInt(teachtime[0]) >= 7 && parseInt(teachtime[0]) < 13)
            }

            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) && (parseInt(searchtime[0]) == 7 && parseInt(teachtime[0]) < 13 && parseInt(teachtime[0]) >= 7))
                return member
            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) &&( ((parseInt(teachtime[0]) >= 13 && parseInt(teachtime[0]) < 16 && parseInt(searchtime[0]) == 13) ) || (parseInt(searchtime[0]) == 13 && parseInt(teachtime[0]) == 16 && parseInt(teachtime[1]) < 30  )))
                return member
            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) &&( (parseInt(teachtime[0]) > 16 && parseInt(searchtime[0]) == 16 ) || (parseInt(searchtime[0]) == 16 && parseInt(teachtime[0]) == 16 && parseInt(teachtime[1]) >= 30  )   )  ) 
                return member
            
            


        }).slice(this.state.firstitem, this.state.lastitem).map(data =>
            <tr>
                <td>{data.subject_id}</td>
                <td>{data.subject_ename}</td>
                <td>{data.section}</td>
                <td>{data.teach_time.split(/[- :]/)[0]}:{data.teach_time.split(/[- :]/)[1]}-{data.teach_time2.split(/[- :]/)[0]}:{data.teach_time2.split(/[- :]/)[1]}</td>
                <td>{data.building_no}</td>
                <td>{data.room_no}</td>
                <td>{data.seat_num}</td>
                <td>{data.studentnum}</td>
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
            var teachtime = member.teach_time.split(/[- :]/);
            var searchtime = this.state.starttime.split(/[- :]/);
            if (this.state.yearsearch == null) {

                this.setState({ curr2search: "00", yearsearch: 2555, semestersearch: 1, daysearch: 1 })
                return member.curr2_id == "00" && member.year == 2555 && member.semester == 1 && member.teach_day == 1 && (parseInt(teachtime[0]) >= 7 && parseInt(teachtime[0]) < 13)
            }

            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) && (parseInt(searchtime[0]) == 7 && parseInt(teachtime[0]) < 13))
                return member

            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) &&( ((parseInt(teachtime[0]) >= 13 && parseInt(teachtime[0]) < 16 && parseInt(searchtime[0]) == 13) ) || (parseInt(searchtime[0]) == 13 && parseInt(teachtime[0]) == 16 && parseInt(teachtime[1]) < 30  )   )                     )
                return member
            else if ((member.curr2_id == this.state.curr2search) && (member.year == this.state.yearsearch) && (member.semester == this.state.semestersearch) && (member.teach_day == this.state.daysearch) &&( (parseInt(teachtime[0]) > 16 && parseInt(searchtime[0]) == 16 ) || (parseInt(searchtime[0]) == 16 && parseInt(teachtime[0]) == 16 && parseInt(teachtime[1]) >= 30  )   )  ) 
                return member

        }).length

        let items = [];
        for (let number = 1; number <= Math.ceil(data_num / this.state.itemperpage); number++) {
            items.push(
                <Pagination.Item className="selectpage" key={number} active={number == this.state.pageclick} onClick={this.pageselect}>
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
            <div >
                <Nav />
                <h1 class="state">จัดห้องเรียน</h1>
                <div id="detail">
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
                        <h5 className="departManfil2">สาขาวิชา</h5>
                        <select className="selectdepart" onChange={(e) => this.searchCurr2(e)}>
                            {
                                this.state.curr2.map((data, index) =>
                                    <option value={data.curr2_id}>{data.curr2_tname}</option>
                                )
                            }
                        </select>
                        <h5 className="dayfil">วันที่เรียน</h5>
                        <select className="selectday" onChange={(e) => this.searchDay(e)}>
                            <option value="1">อาทิตย์</option>
                            <option value="2">จันทร์</option>
                            <option value="3">อังคาร</option>
                            <option value="4">พุธ</option>
                            <option value="5">พฤหัสบดี</option>
                            <option value="6">ศุกร์</option>
                            <option value="7">เสาร์</option>
                        </select>
                        <h5 className="periodTimefil">ช่วงเวลาที่เรียน</h5>
                        <select className="selectime" onChange={(e) => this.searchTime(e)}>
                            <option value="7:00">เช้า</option>
                            <option value="13:00">บ่าย</option>
                            <option value="16:30">ค่ำ</option>
                        </select>
                        <div id="buttonManage">
                            <Button variant="light" className="managebtn" onClick ={(e) => this.manageroom(e)}>จัดห้อง</Button>
                        </div>
                    </div>

                    <table className="Crtable">
                        <thead>
                            <tr className="ManageTable">
                                <th>รหัสวิชา</th>
                                <th>ชื่อวิชา</th>
                                <th>กลุ่ม</th>
                                <th>เวลาเรียน</th>
                                <th>รหัสอาคาร</th>
                                <th>ห้อง</th>
                                <th>จำนวนที่นั่ง</th>
                                <th>จำนวนนศ.</th>
                                <th>แก้ไขข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item}
                        </tbody>
                    </table>
                    <Button variant="light" className="downloadbtn">Download เอกสาร</Button>
                    <Button variant="light" className="adddata">
                        <img src={addbt} className="addicon" alt="add" />
                    </Button>
                    {paginationBasic}
                    <Foot />
                </div>
            </div>
        )

    }


}
