import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Navbar/NavCr'
import editbt from './icon/edit.png';
import deletebt from './icon/trash.png';
import addbt from './icon/plus.png';
import './BuildingData.css';
import Foot from '../Navbar/FooterCr'
import axios from 'axios';
import { Component } from 'react';
import { json } from 'body-parser';
import Pagination from 'react-bootstrap/Pagination'
import Modal from 'react-bootstrap/Modal'

export default class BuildingData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: [],
            pageclick: 1,
            itemperpage: 10,
            firstitem: null,
            lastitem: null,
            show: false,
            showsubmit: false,
            showfailed: false,
            building_no: null,
            rows: null,
            building_no_data: null,
            building_name: null,
            floor_num: null,
            editlist: [],
            olddata: []
        }
        
        this.pageselect = this.pageselect.bind(this);

        //delete row
        this.deletebt = this.deletebt.bind(this)
        this.confirmdelete = this.confirmdelete.bind(this);

        //modal
        this.handleClose = this.handleClose.bind(this);
        this.handleClosesubmit = this.handleClosesubmit.bind(this);
        this.handleClosefailed = this.handleClosefailed.bind(this);

        //add row
        this.addrow = this.addrow.bind(this);
        this.handleChange_building_no = this.handleChange_building_no.bind(this)
        this.handleChange_building_name = this.handleChange_building_name.bind(this)
        this.handleChange_floornum = this.handleChange_floornum.bind(this)

        //edit data
        this.enableedit = this.enableedit.bind(this)
        this.canceledit = this.canceledit.bind(this)
        this.confirmedit = this.confirmedit.bind(this)
        this.handleChange_editbuilding_no = this.handleChange_editbuilding_no.bind(this)
        this.handleChange_editbuilding_name = this.handleChange_editbuilding_name.bind(this)
        this.handleChange_editfloor_num = this.handleChange_editfloor_num.bind(this)

        this.componentWillMount = this.componentWillMount.bind(this);
    }
   

    //handle modal
    handleClose() {
        this.setState({
            show: false
        })
    }
    handleClosesubmit() {

        this.setState({
            showsubmit: false
        })
        window.location.reload(false);
    }

    handleClosefailed() {
        this.setState({
            showfailed: false
        })
        window.location.reload(false);

    }

    //handle addrow data 
    handleChange_building_no(event) {
        this.setState({ building_no_data: event.target.value })
    }

    handleChange_building_name(event) {
        this.setState({ building_name: event.target.value })
    }
    handleChange_floornum(event) {
        this.setState({ floor_num: event.target.value })
    }


    //edit data handle
    handleChange_editbuilding_name(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].building_name = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state
    }
    handleChange_editbuilding_no(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].building_no = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state

    }
    handleChange_editfloor_num(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].floor_num = event.target.value //execute the manipulations
        this.setState({ name: newIds }) //set the new state
        //this.setState({ building_name: event.target.value })
    }

    //insert row confirm
    confirmdata = () => {
        axios
            .post("http://localhost:7777/building/insert", {
                data: {
                    building_no: this.state.building_no_data,
                    building_name: this.state.building_name,
                    floor_num: this.state.floor_num
                }
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

    //show row input for insert
    addrow = () => {
        this.setState({
            rows: <tr>
                <td>
                    <input
                        value={this.state.building_no_data}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        onChange={this.handleChange_building_no}
                    />
                </td>
                <td>
                    <input
                        value={this.state.building_name}
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput"
                        onChange={this.handleChange_building_name}
                    />
                </td>
                <td>
                    <input
                        value={this.state.floor_num}
                        type="number"
                        className="form-control"
                        id="formGroupExampleInput"
                        onChange={this.handleChange_floornum}
                        min = "0"
                    />
                </td>
                <td>
                    <Button variant="link" onClick={() => this.delrow()}>ยกเลิก</Button>

                    <Button variant="primary" onClick={() => this.confirmdata()} >ยืนยัน</Button>
                </td>
            </tr>


        })
    }

    //delete row input
    delrow = () => {
        this.setState({
            rows: null,
            building_no_data: null,
            building_name: null,
            floor_num: null
        })
    }
    
    //delete row button 
    deletebt = (data) => {
        this.setState({
            show: true,
            building_no: data
        })
    }
    
    //confirm delete row in table function
    confirmdelete() {
        axios
            .delete("http://localhost:7777/building/delete", { data: { building_no: this.state.building_no } })
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
        this.handleClose()
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
            .put("http://localhost:7777/building/update", {
                
                    building_no: this.state.name[index].building_no,
                    building_name: this.state.name[index].building_name,
                    floor_num: this.state.name[index].floor_num,
                    building_no_select: olddata[index].building_no
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
            const newIds = this.state.editlist.slice() //copy the array
            newIds[index] = 1//execute the manipulations
            this.setState({ editlist: newIds }) //set the new state
        }
    }

    componentWillMount() {
        axios.get('http://localhost:7777/building')
            .then(res => {
                const newIds = this.state.editlist.slice()
                for (var i = 0; i < res.data.length; i++) {
                    newIds.push(0)
                }
                this.setState({
                    name: res.data,
                    editlist: newIds,
                    olddata: JSON.stringify(res.data)
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
        let newId = this.state.editlist.slice()
        for(var i = 0 ;i< newId.length;i++){
            if(newId[i] == 1){
                newId[i] = 0
            }
        }

        this.setState({
            pageclick: parseInt(e.target.textContent),
            firstitem: (this.state.itemperpage * parseInt(e.target.textContent)) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * parseInt(e.target.textContent)),
            editlist: newId,
            name: JSON.parse(this.state.olddata),

        })
    }




    render() {
        const item = this.state.name.filter((member, index) => {

            return member
        }).slice(this.state.firstitem, this.state.lastitem).map((data, index) => {
            if (this.state.editlist[index] == 1) {
                return (

                    <tr>
                        <td>
                            <input
                                value={data.building_no}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                onChange={(e) => this.handleChange_editbuilding_no(((this.state.pageclick-1)*this.state.itemperpage) +index, e)}
                            />
                        </td>
                        <td>
                            <input
                                value={data.building_name}
                                type="text"
                                className="form-control"
                                id="formGroupExampleInput"
                                onChange={(e) => this.handleChange_editbuilding_name(((this.state.pageclick-1)*this.state.itemperpage) +index, e)}
                            /></td>
                        <td>
                            <input
                                value={data.floor_num}
                                type="number"
                                className="form-control"
                                id="formGroupExampleInput"
                                min = "1"
                                onChange={(e) => this.handleChange_editfloor_num(((this.state.pageclick-1)*this.state.itemperpage) +index, e)}
                            />
                        </td>
                        <td>
                            <Button variant="link" onClick={() => this.canceledit(index)}>ยกเลิก</Button>

                            <Button variant="primary" onClick={() => this.confirmedit(((this.state.pageclick-1)*this.state.itemperpage) +index)} >ยืนยัน</Button>
                        </td>
                    </tr>

                )
            } else {
                return (

                    <tr>
                        <td> {data.building_no}</td>
                        <td>{data.building_name}</td>
                        <td>{data.floor_num}</td>
                        <td>
                            <Button variant="light" className="editdata" onClick={() => this.enableedit(index)}>
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata" onClick={() => this.deletebt(data.building_no)}>
                                <img src={deletebt} className="deleteicon" alt="delete" />
                            </Button>
                        </td>
                    </tr>

                )
            }

        }




        )

        let data_num = this.state.name.filter((member) => {
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
        return (
            <div >
                <Nav />
                <h1 class="state">ข้อมูลอาคารเรียน</h1>
                <div id="detail">
                    <table className="Crtable">
                        <thead>
                            <tr className="Buildtable">
                                <th>รหัสอาคาร</th>
                                <th>อาคารเรียน</th>
                                <th>จำนวนชั้นทั้งหมด</th>
                                <th>แก้ไขข้อมูล</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                item
                            }
                            {this.state.rows}
                        </tbody>
                    </table>
                    <Button variant="light" className="adddata" onClick={() => this.addrow()}>
                        <img src={addbt} className="addicon" alt="add" />
                    </Button>
                    {paginationBasic}
                    <Foot />
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
                        <Button variant="primary" onClick={this.confirmdelete}>
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
            </div>
        );
    }

}
