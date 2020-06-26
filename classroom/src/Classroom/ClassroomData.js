import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import Foot from '../Navbar/FooterCr'
import axios from 'axios';
import { Component } from 'react';
import { json } from 'body-parser';
import './ClassroomData.css';
import Pagination from 'react-bootstrap/Pagination'

export default class ClassroomData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            building: [],
            result: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            search: null,
            floor_no: null,
            pageclick:1,
            itemperpage:10,
            firstitem:null,
            lastitem:null,
        }
        this.test = this.pageselect.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);

    }
    componentWillMount() {
        axios.get('http://localhost:7777/classroom')
            .then(res => {
                this.setState({
                    name: res.data,
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
    searchSpace = (event) => {
        let keyword = event.target.value;
        this.setState({ search: keyword })
    }
    searchSpace1 = (event) => {
        let keyword = event.target.value;
        this.setState({ floor_no: keyword ,pageclick:1})
    }

    pageselect(e) {
        this.setState({ 
            pageclick: parseInt(e.target.textContent),
            firstitem: (this.state.itemperpage * parseInt(e.target.textContent) ) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * parseInt(e.target.textContent) )
        })
    }

    render() {
        const item = this.state.name.filter((member) => {
            if (this.state.search == null){
                this.setState({search:"CCA",floor_no:1})
                return member.building_no == "CCA" && (member.room_floor == "1")
            }
            else if ((member.building_no == this.state.search) && (member.room_floor == this.state.floor_no))
                return member
        }).slice(this.state.firstitem,this.state.lastitem).map(data =>
            <tr>
                <td>{data.building_no}</td>
                <td>{data.building_name}</td>
                <td>{data.room_no}</td>
                <td>{data.seat_num}</td>
                <td>
                    <Form>
                        <Form.Check
                            type="switch"
                            id="custom-switch2"
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
            if (this.state.search == null)
                return member.building_no == "ECC" && (member.room_floor == "1")
            else if ((member.building_no == this.state.search) && (member.room_floor == this.state.floor_no))
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

        const floor_num = this.state.building.filter((member) => {
            if (member.building_no == this.state.search) {
                while (this.state.result.length) {
                    this.state.result.pop();
                }
                for (let i = 1; i <= member.floor_num; i++) {

                    this.state.result.push(i)
                }
                return member
            }
        })

        const test = this.state.result.map((data, index) =>
            <option value={data}>{data}</option>
        )



        return (
            <div >
                <Nav />
                <h1 class="state">ข้อมูลห้องเรียน</h1>
                <div id="detail">
                    <div className="filterCrData">
                        <h4 className="buildfil1">อาคารเรียน</h4>
                        <div className="buildfildetail1">
                            <select id="building" onChange={(e) => this.searchSpace(e)} >
                                {
                                    this.state.building.map((data, index) =>
                                        <option value={data.building_no}>{data.building_name}</option>
                                    )
                                }
                            </select>
                        </div>
                        <h4 className="buildfil2">ชั้น</h4>
                        <div className="buildfildetail2">
                            <select id="floor_num" onChange={(e) => this.searchSpace1(e)}>
                                {
                                    test
                                }
                            </select>
                        </div>
                    </div>
                    
                    <table className="Crtable">
                        <thead>
                            <tr className="Buildtable">
                                <th>รหัสอาคาร</th>
                                <th>อาคารเรียน</th>
                                <th>รหัสห้อง</th>
                                <th>จำนวนที่นั่ง</th>
                                <th>สถานะ</th>
                                <th>แก้ไขข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                item
                            }
                        </tbody>
                    </table>
                    <Button variant="light" className="adddata">
                        <img src={addbt} className="addicon" alt="add" />
                    </Button>
                    {paginationBasic}
                    <Foot />
                </div>
            </div>
        );
    }

}



