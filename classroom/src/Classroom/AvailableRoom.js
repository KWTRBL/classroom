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
import './AvailableRoom.css'

export default class AvailiableRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            year: [],
            semester: [],
            building: [],
            stateyear: 0,
            yearsearch: null,
            semestersearch: null,
            buildingsearch: null,
            daysearch: null,
            result: [1, 2, 3],
            pageclick: 1,
            itemperpage: 10,
            firstitem: null,
            lastitem: null,
            timezone: 1

        }
        this.pageselect = this.pageselect.bind(this);
        this.pageselectvalue = this.pageselectvalue.bind(this);

        this.componentWillMount = this.componentWillMount.bind(this);
    }
    componentWillMount() {
        axios.get('http://localhost:7777/availableroom')
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

        axios.get('http://localhost:7777/building')
            .then(res => {
                this.setState({
                    building: res.data,
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
            stateyear: 0,
        })
        this.pageselectvalue(1)
    }
    searchSemester = (event) => {
        let keyword = event.target.value;
        this.setState({ semestersearch: keyword})
        this.pageselectvalue(1)
    }
    searchBuilding = (event) => {
        let keyword = event.target.value;
        this.setState({ buildingsearch: keyword})
        this.pageselectvalue(1)
    }
    searchDay = (event) => {
        let keyword = event.target.value;
        this.setState({ daysearch: keyword})
        this.pageselectvalue(1)
    }

    searchTime = (event) => {
        let keyword = event.target.value;
        this.setState({ timezone: keyword })
        this.pageselectvalue(1)
    }


    render() {
        const item = this.state.name.filter((member) => {
                if (this.state.yearsearch == null) {
                    this.setState({ buildingsearch: "CCA", yearsearch: 2555, semestersearch: 1, daysearch: 1,timezone: 1 })
                    return member.building_no == this.state.buildingsearch && member.year == this.state.yearsearch && member.semester == this.state.semestersearch && member.teach_day == this.state.daysearch 
                }

                else {
                    return member.building_no == this.state.buildingsearch && member.year == this.state.yearsearch && member.semester == this.state.semestersearch && member.teach_day == this.state.daysearch
                }

        }).slice(this.state.firstitem, this.state.lastitem).map(data =>{
            if(this.state.timezone == 1){
                return(<tr>
                    <td>{data.room_floor}</td>
                    <td>{data.room_no}</td>
                    <td>{data.morning?"ไม่ว่าง":"ว่าง"}</td>
                </tr>)
            }if(this.state.timezone == 2){
                return(<tr>
                    <td>{data.room_floor}</td>
                    <td>{data.room_no}</td>
                    <td>{data.noon?"ไม่ว่าง":"ว่าง"}</td>
                </tr>)
            }
            if(this.state.timezone == 3){
                return(<tr>
                    <td>{data.room_floor}</td>
                    <td>{data.room_no}</td>
                    <td>{data.evening?"ไม่ว่าง":"ว่าง"}</td>
                </tr>)
            }
        }
            
        )

        let data_num = this.state.name.filter((member) => {
            if (this.state.yearsearch == null) {
                this.setState({ buildingsearch: "CCA", yearsearch: 2555, semestersearch: 1, daysearch: 1,timezone: 1 })
                return member.building_no == this.state.buildingsearch && member.year == this.state.yearsearch && member.semester == this.state.semestersearch && member.teach_day == this.state.daysearch 
            }

            else {
                return member.building_no == this.state.buildingsearch && member.year == this.state.yearsearch && member.semester == this.state.semestersearch && member.teach_day == this.state.daysearch
            }
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
            <div >
                <Nav />
                <h1 class="state">สถานะการใช้ห้องเรียน</h1>
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
                        <h5 className="buildingfil2">อาคารเรียน</h5>
                        <select className="selectbuilding" onChange={(e) => this.searchBuilding(e)} >
                                {
                                    this.state.building.map((data, index) =>
                                        <option value={data.building_no}>{data.building_name}</option>
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
                            <option value="1">เช้า</option>
                            <option value="2">บ่าย</option>
                            <option value="3">ค่ำ</option>
                        </select>
                    </div>

                    <table className="Crtable">
                        <thead>
                            <tr className="ManageTable">
                                <th>ชั้น</th>
                                <th>ห้อง</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item}
                        </tbody>
                    </table>
                    {paginationBasic}
                    <Foot />
                </div>
            </div>
        )

    }


}
