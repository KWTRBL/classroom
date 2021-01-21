import React from "react";
import { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FooterCr.css";

class NavBar extends Component {
  render() {
    return (
      <div className="footer">
        <p className="footer-text">
          คณะวิศวกรรมศาสตร์ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง
        </p>
        <p className="footer-text">
          เลขที่ 1 ซอยฉลองกรุง 1 ถนนฉลองกรุง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ
          10520
        </p>
        <p className="footer-text">เวลาทำการ 8.30-16.30 น. โทร 02-329-8321</p>
        <p className="footer-text">© FACULTY OF ENGINEERING, 2019</p>
      </div>
    );
  }
}

export default NavBar;
