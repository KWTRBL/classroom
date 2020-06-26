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

export default class BuildingData extends Component {
    constructor(props) {
      super(props);
      this.state = {
          name: [],
          pageclick:1,
          itemperpage:10,
          firstitem:null,
          lastitem:null,
      }
        this.test = this.pageselect.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
  }
  

  
    componentWillMount() {
        axios.get('http://localhost:7777/building')
        .then(res => {
          this.setState({
            name: res.data,
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
            firstitem: (this.state.itemperpage * parseInt(e.target.textContent) ) - this.state.itemperpage,
            lastitem: (this.state.itemperpage * parseInt(e.target.textContent) )
        })
    }


    render() {
        const item = this.state.name.filter((member) => {
            return member
        }).slice(this.state.firstitem,this.state.lastitem).map(data =>
            <tr>
                <td>{data.building_no}</td>
                <td>{data.building_name}</td>
                <td>{data.floor_num}</td>
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
