import React, { useEffect, useState, useRef } from 'react';
import Styles from '../styles/mypage.module.css';
import navStyles from '../styles/nav.module.css';
import logo from '../../public/logo.png';
import leftIcon from '../../public/images/free-icon-font-angle-left-3916934.svg';
import rightIcon from '../../public/images/free-icon-font-angle-right-3916924.svg';
import userImg from '../../public/images/user1.png'
import Image from 'next/image';

function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dateGridItems, setDateGridItems] = useState([]);

  // 달력 및 공부 시간 변경
  useEffect(() => {
    const setCalendar = (year, month) => {
      const firstDate = new Date(year, month - 1, 1);
      const firstDay = firstDate.getDay();
      const lastDate = new Date(year, month, 0).getDate();

      const setTitle = (year, month) => {
        const title_year = document.getElementById("title_year");
        const title_month = document.getElementById("title_month");
        if (title_year && title_month) {
          title_year.innerHTML = year;
          title_month.innerHTML = month;
        }
      };
      setTitle(year, month);

      const gridItems = [];
      for (let i = 1; i <= lastDate; i++) {
        gridItems.push(<div key={i} className={Styles['grid-item']}>{i}</div>);
      }
      setDateGridItems(gridItems);

      const dateGridContainerDiv = document.getElementById("date_grid_container");
      if (dateGridContainerDiv) {
        const firstDateDiv = dateGridContainerDiv.querySelector(`.${Styles['grid-item']}`);
        if (firstDateDiv) {
          firstDateDiv.style.gridColumnStart = firstDay + 1;
        }
      }
    };

    setCalendar(year, month);
  }, [year, month]);

  const prevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth === 0) {
      newYear--;
      newMonth = 12;
    }
    setYear(newYear);
    setMonth(newMonth);
  };

  const nextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth === 13) {
      newYear++;
      newMonth = 1;
    }
    setYear(newYear);
    setMonth(newMonth);
  };

  // 총 공부 시간
  const monthTotal = '02:26:00';

  // 최근 공부 시간
  const studyTimeData = [
    { date: '5/25', time: '02:00:00' },
    { date: '5/26', time: '02:00:00' },
    { date: '5/27', time: '02:00:00' },
    { date: '5/28', time: '02:00:00' },
    { date: '5/29', time: '02:00:20' },
    { date: '5/30', time: '02:00:00' },
    { date: '5/31', time: '02:00:00' },
  ];

  const renderStudyTimeRows = () => {
    return studyTimeData.map((item, index) => (
      <tr key={index}>
        <td className={Styles.studyDate}>{item.date}</td>
        <td className={Styles.studyTime}>{item.time}</td>
      </tr>
    ));
  };

  return (
    <div className={Styles.App}>
      <nav className={navStyles.nav}>
        <div className={navStyles['nav-container']}>
          <a className={navStyles.logo} href="/">
            <Image className={navStyles['logo-img']} src={logo} alt="Logo" />
          </a>
          <ul className={navStyles['nav-list']}>
            <li className={navStyles.community}>
              <a href="community">Community</a>
            </li>
            <li className={navStyles.mypage}>
              <a href="mypage">My Page</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className={Styles.container}>
        <div className={Styles.container1}>
          <div className={Styles.user}>
            <Image className={Styles.profile} src={userImg} alt="프로필" />

            <div className={Styles.userinfo}>
              <p className={Styles.username}>양혜원</p>
              <p className={Styles.useremail}>w2106@e-mirim.hs.kr</p>
              <button className={Styles.userLogout}>로그아웃</button>
            </div>
          </div>

          <div className={Styles.totalTime}>
            <h1 className={Styles.totalH1}>{year}년 {month}월 총 공부시간</h1>
            <span className={Styles.totalSpan}>{monthTotal}</span>
          </div>
        </div>

        <div className={Styles.container2}>
            <div className={Styles.usertimecontainer}>
                <div className={Styles.usertimecal}>
                    <table className={Styles.studyTime}>
                        <thead>
                            <tr>
                            <th className={Styles.studyTimeTh}>날짜</th>
                            <th className={Styles.studyTimeTh}>시간</th>
                            </tr>
                        </thead>
                        <tbody>{renderStudyTimeRows()}</tbody>
                    </table>
                </div>
            </div>

          <div className={Styles.usercalendar}>
            <div className={Styles.calendar}>
              <div className={Styles['flex-container']}>
                <div className={Styles.prevBtn} onClick={prevMonth}>
                  <Image src={leftIcon} className={Styles['angle-icon']} alt="이전" />
                </div>
                <h1 className={Styles['calendar-h1']}>
                  <span id="title_year" className={Styles.titleYear}></span>년 <span id="title_month" className={Styles.titleMonth}></span>월
                </h1>
                <div className={Styles.nextBtn} onClick={nextMonth}>
                  <Image src={rightIcon} className={Styles['angle-icon']} alt="다음" />
                </div>
              </div>
              <div className={Styles.calendar}>
                <div className={Styles['grid-container-calendar']}>
                  <div className={Styles['grid-item']}>일</div>
                  <div className={Styles['grid-item']}>월</div>
                  <div className={Styles['grid-item']}>화</div>
                  <div className={Styles['grid-item']}>수</div>
                  <div className={Styles['grid-item']}>목</div>
                  <div className={Styles['grid-item']}>금</div>
                  <div className={Styles['grid-item']}>토</div>
                </div>
                <div id='date_grid_container' className={Styles['date-grid-container']}>{dateGridItems}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
