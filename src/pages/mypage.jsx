import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import firebase from '../../firebase';
import Styles from '../styles/mypage.module.css';
import navStyles from '../styles/nav.module.css';
import logo from '../../public/images/logo.png';
import leftIcon from '../../public/images/free-icon-font-angle-left-3916934.svg';
import rightIcon from '../../public/images/free-icon-font-angle-right-3916924.svg';
/* 학생 사진 import */
import girl_shorthair from '../../public/images/girl_shorthair_p.png'
import girl_longhair from '../../public/images/girl_longhair_p.png'
import boy_blackhair from '../../public/images/boy_blackhair_p.png'
import boy_brownhair from '../../public/images/boy_brownhair_p.png'
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Swal from 'sweetalert2';

import firebaseApp from "@/net/firebaseApp";
import db from "@/net/db";
import auth from "@/net/auth";

const app = firebaseApp;

function MyPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dateGridItems, setDateGridItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [monthTotal, setMonthTotal] = useState('00:00:00'); // 총 공부 시간
  const [studyTimeData, setStudyTimeData] = useState([]);
  const router = useRouter();

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    // const auth = getAuth(firebase);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);

        // 사용자 정보 가져오기
        const { displayName, email, uid } = user;
        setDisplayName(displayName);
        setEmail(email);
        
        fetchStudyTimeData();
        calculateMonthTotal(year, month);

        // 사용자 프로필 이미지 가져오기
        const firestore = getFirestore(firebase);
        const userCollection = collection(firestore, 'users');
        const userDocRef = doc(userCollection, uid);
        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const { characterId } = docSnapshot.data();
              // characterId에 따라 프로필 이미지 설정
              if (characterId === 'girl_shorthair') {
                setProfileImg(girl_shorthair);
              } else if (characterId === 'girl_longhair') {
                setProfileImg(girl_longhair);
              } else if (characterId === 'boy_blackhair') {
                setProfileImg(boy_blackhair);
              } else if (characterId === 'boy_brownhair') {
                setProfileImg(boy_brownhair);
              }
            }
          })
          .catch((error) => {
            console.log('Error getting user profile:', error);
          });
        }
        });

        return () => {
          unsubscribe();
        };
  }, []);

  // 로그아웃
  const handleLogout = () => {
    const auth = getAuth(firebase);
    signOut(auth)
      .then(() => {
        console.log('로그아웃 성공');
        router.push('/startpage'); // startpage로 이동
      })
      .catch((error) => {
        console.log('로그아웃 에러:', error);
      });
  };

  const chkLogout = () => {
    Swal.fire({
      title: "로그아웃 하시겠나요?",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
      icon: 'question',
    }).then(result => {
        if (result.isConfirmed) {
            handleLogout();
        }
    })
  }
  ////////////////////////////////////////////

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
    calculateMonthTotal(year, month); // 초기 로드 시 총 공부 시간 계산
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
    calculateMonthTotal(newYear, newMonth); // Update monthTotal
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
    calculateMonthTotal(newYear, newMonth); // Update monthTotal
  };

  ////////////////////////////////////////////

  // studyTimeData을 화면에 출력함
  const renderStudyTimeRows = () => {
    return studyTimeData.map((item, index) => (
      <tr key={index}>
        <td className={Styles.studyDate}>{item.date}</td>
        <td className={Styles.studyTime}>{item.time}</td>
      </tr>
    ));
  };

  // 월별 공부 시간
  const calculateMonthTotal = async (newYear, newMonth) => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const firestore = getFirestore(firebase);
      const timesCollection = collection(firestore, `times/${uid}/dates`);

      try {
        const querySnapshot = await getDocs(timesCollection);
        let totalHours = 0;
        let totalMinutes = 0;
        let totalSeconds = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const documentName = doc.id; // 문서 이름 (yyyyMMdd)

          const documentYear = documentName.slice(0, 4);
          const documentMonth = documentName.slice(4, 6);

          if (documentYear == newYear && documentMonth == newMonth) {
            // Only consider documents with matching year and month
            const { hours, minutes, seconds } = data;
            totalHours += hours || 0;
            totalMinutes += minutes || 0;
            totalSeconds += seconds || 0;
          }
        });

        // Calculate total time
        let seconds = totalSeconds % 60;
        let minutes = Math.floor(totalSeconds / 60) + totalMinutes;
        let hours = Math.floor(minutes / 60) + totalHours;
        minutes %= 60;

        // Format hours, minutes, and seconds as two-digit numbers
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        const totalTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        setMonthTotal(totalTime); // 총 공부 시간 업데이트
      } catch (error) {
        console.log('Error fetching study time data:', error);
      }
    }
  };

  // 지난 7일의 데이터를 저장하고 출력함
  const fetchStudyTimeData = async () => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;
  
    if (user) {
      const uid = user.uid;
      const firestore = getFirestore(firebase);
      const timesCollection = collection(firestore, `times/${uid}/dates`);
  
      try {
        const querySnapshot = await getDocs(timesCollection);
  
        const startDate = new Date(); // 현재 날짜
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 7); // 최근 7일 전 날짜
  
        const studyTimeData = [];
  
        // 최근 7일간의 데이터를 저장할 배열 생성
        const studyTimeDataMap = new Map();
  
        querySnapshot.forEach((doc) => {
          const documentName = doc.id; // 문서 이름 (yyyyMMdd)
          const documentDate = new Date(
            documentName.slice(0, 4),
            parseInt(documentName.slice(4, 6)) - 1,
            documentName.slice(6, 8)
          );
  
          // 시작 날짜부터 종료 날짜까지의 데이터만 처리
          if (documentDate >= endDate && documentDate <= startDate) {
            const { hours, minutes, seconds } = doc.data();
  
            // 시간, 분, 초를 두 자리 숫자로 포맷팅
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');
  
            // 시간 데이터를 tt:mm:ss 형식으로 저장
            const time = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  
            // 날짜 데이터를 mm/dd 형식으로 저장
            const date = `${documentDate.getMonth() + 1}/${documentDate.getDate()}`;
  
            // studyTimeDataMap에 { date, time } 객체 추가
            studyTimeDataMap.set(date, time);
          }
        });
  
        // 7개의 데이터를 생성하고 time이 없는 경우 00:00:00으로 설정
        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(currentDate.getDate() - i);
  
          // 날짜 데이터를 mm/dd 형식으로 저장
          const date = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
          const time = studyTimeDataMap.get(date) || '00:00:00';
  
          // studyTimeData에 { date, time } 객체 추가
          studyTimeData.push({ date, time });
        }
  
        studyTimeData.reverse();

        // studyTimeData 업데이트
        setStudyTimeData(studyTimeData);
      } catch (error) {
        console.log('Error fetching study time data:', error);
      }
    }
  };

  const userCharChg = () => {
    router.push('/characters');
  }
  


  return (
    <div className={Styles.App}>
      <nav className={navStyles.nav}>
        <div className={navStyles['nav-container']}>
          <a className={navStyles.logo} href="/community">
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
            <Image className={Styles.profile} src={profileImg} alt="프로필"
            width={150}
            height={150} />

            <div className={Styles.userinfo}>
              <p className={Styles.username}>{displayName}</p>
              <p className={Styles.useremail}>{email}</p>
              <button className={`${Styles.btns} ${Styles.fbtn}`} onClick={chkLogout}>로그아웃</button>
              <button className={Styles.btns} onClick={userCharChg}>캐릭터 변경</button>
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

export default MyPage;
