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
import './ManageGroup.css';

export default class ManageGroup extends Component {
    constructor(props) {
      super(props);
      this.state = {
            name: [],
            pageclick:1,
            itemperpage:10,
            firstitem:null,
            lastitem:null,
            curr2_id:null,
            class:null,
            sec1:null,
            sec2:null,
            sec3:null,
            editlist: [],
            olddata: []
      }
        this.pageselect = this.pageselect.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        //edit data
        this.enableedit = this.enableedit.bind(this)
        this.canceledit = this.canceledit.bind(this)
        this.confirmedit = this.confirmedit.bind(this)
        this.handleChange_editsec1 = this.handleChange_editsec1.bind(this)
        this.handleChange_editsec2 = this.handleChange_editsec2.bind(this)
        this.handleChange_editsec3 = this.handleChange_editsec3.bind(this)
  }
  componentWillMount() {
        axios.get('http://localhost:7777/groupdata')
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

    //edit data handle
    handleChange_editsec1(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].sec1 = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state
    }
    handleChange_editsec2(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].sec2 = event.target.value //execute the manipulations
        this.setState({ name: newIds }) //set the new state
    }    
    handleChange_editsec3(index, event) {
        const newIds = this.state.name //copy the array
        newIds[index].sec3 = event.target.value//execute the manipulations
        this.setState({ name: newIds }) //set the new state

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
            .put("http://localhost:7777/groupdata/update", {

                    curr2_id: olddata[index].curr2_id,
                    class: olddata[index].class,
                    sec1: this.state.name[index].sec1,
                    sec2: this.state.name[index].sec2,
                    sec3: this.state.name[index].sec3
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

    render() {
        const item = this.state.name.filter((member,index) => {
            return member
        }).slice(this.state.firstitem,this.state.lastitem).map((data,index) =>
        {
            if (this.state.editlist[index] == 1) {
                return (

                    <tr>
                        <td>{data.curr2_tname}</td>
                        <td>{data.class}</td>
                        <td>
                            <input
                                value={data.sec1}
                                type="number"
                                className="form-control"
                                id="formGroupExampleInput"
                                min="0"
                                onChange={(e) => this.handleChange_editsec1(((this.state.pageclick-1)*this.state.itemperpage) +index, e)}
                            />
                        </td>
                        <td>
                            <input
                                value={data.sec2}
                                type="number"
                                className="form-control"
                                id="formGroupExampleInput"
                                min = "0"
                                onChange={(e) => this.handleChange_editsec2(((this.state.pageclick-1)*this.state.itemperpage) +index, e)}
                            />
                        </td>
                        <td>
                            <input
                                value={data.sec3}
                                type="number"
                                className="form-control"
                                id="formGroupExampleInput"
                                min = "0"
                                onChange={(e) => this.handleChange_editsec3(((this.state.pageclick-1)*this.state.itemperpage) + index, e)}
                            />
                        </td>
                        <td>
                            <Button variant="link" onClick={() => this.canceledit(index)}>ยกเลิก</Button>

                            <Button variant="primary" onClick={() => this.confirmedit(((this.state.pageclick-1)*this.state.itemperpage) + index)} >ยืนยัน</Button>
                        </td>
                    </tr>

                )
            } else {
                return (
                    <tr>
                        <td>{data.curr2_tname}</td>
                        <td>{data.class}</td>
                        <td>{data.sec1}</td>
                        <td>{data.sec2}</td>
                        <td>{data.sec3}</td>
                        <td>
                            <Button variant="light" className="editdata" onClick={() => this.enableedit(index)}> 
                                <img src={editbt} className="editicon" alt="edit" />
                            </Button>
                            <Button variant="light" className="deletedata">
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
        return (
            <div >
                <Nav/>
                <h1 class="state">จัดจำนวนนักศึกษาแต่ละกลุ่ม</h1>
                <div id="detail">
                    <table className="Crtable">
                        <thead>
                        <tr className="Managegrouptable">
                            <th>สาขา</th>
                            <th>ชั้นปี</th>
                            <th>กลุ่ม 1</th>
                            <th>กลุ่ม 2</th>
                            <th>กลุ่ม 3</th>
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
                    <Foot/>
                </div>
            </div>
        );
    }
}

