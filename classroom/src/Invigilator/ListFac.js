import React from 'react';
import './ListFac.css';
import './nevbarInvi.js'
import ReactDOM from 'react-dom';
import Panda from './pic/Panda.png';
import Button from 'react-bootstrap/Button';
import Search from './pic/search.png';

function Listt(){
    return (
    <div id="All">
        <div id="mode">
            <h1 id="Webname">Classroom <br></br>management</h1>
            <img src={Panda} id="ProfilePic"/>
            <div>
                <ul class="menu">
                    <li><a href="">รายชื่ออาจารย์</a></li>
                    <li><a href="">จัดอาจารย์คุมสอบ</a></li>
                    <li><a href="">Download เอกสาร</a></li>
                </ul>
            </div>
        </div>
        <div id="detail">
            <h1>รายชื่อผู้คุมสอบ</h1>
            <input type="text" placeholder="search"></input>
            <button class="btn"><img src={Search} id="SearchPic"/></button>
            <h3 id="departlabel">ภาควิชา</h3>
            <select id="department">
                <option value="0">ทุกภาควิชา</option>
                <option value="1">วิศวกรรมโทรคมนาคม</option>
                <option value="2">วิศวกรรมไฟฟ้า</option>
                <option value="3">วิศวกรรมอิเล็กทรอนิกส์</option>
                <option value="4">วิศวกรรมระบบควบคุม</option>
                <option value="5">วิศวกรรมคอมพิวเตอร์</option>
                <option value="6">วิศวกรรมเครื่องกล</option>
                <option value="7">วิศวกรรมการวัดคุม</option>
                <option value="8">วิศวกรรมโยธา</option>
                <option value="9">วิศวกรรมเกษตร</option>
                <option value="10">วิศวกรรมเคมี</option>
                <option value="11">วิศวกรรมอาหาร</option>
                <option value="12">วิศวกรรมอุตสาหการ</option>
                <option value="13">วิศวกรรมชีวการแพทย์</option>
                <option value="14">สำนักงานบริหารหลักสูตรวิศวกรรมสหวิทยาการนานาชาติ</option>
            </select>
            <table bordered>
                <thead>
                    <tr>
                        <th>รายชื่ออาจารย์</th>
                        <th>การคุมสอบ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>อาจารย์ AAA</td>
                        <td>
                            <select id="setstatus">
                                <option value="0">คุมสอบ</option>
                                <option value="1">ไม่คุมสอบ</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>อาจารย์ BBB</td>
                        <td>
                            <select id="setstatus">
                                <option value="0">คุมสอบ</option>
                                <option value="1">ไม่คุมสอบ</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
      
    );
  }

export default Listt;
