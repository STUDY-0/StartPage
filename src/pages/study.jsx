// import firebase from '../../firebase';
import firebase from "firebase/app";
import styles from '../styles/study.module.css';
import React, { useState, useEffect, useRef } from 'react';
import Timer from '../../src/Timer';
import navStyles from "../styles/nav.module.css";
import Image from 'next/image';
import logo from '../../public/images/logo.png';
// import firebase from 'firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { getFirestore, getDocs, collection, query } from 'firebase/firestore';
import { format } from 'date-fns';
// import db from "../net/db";
import { doc, getDoc } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import io from "socket.io-client";

function Study() {
  const router = useRouter();
  const db = getFirestore();
  const auth = getAuth();
  const currentDate = format(new Date(), 'yyyyMMdd'); // 현재 날짜를 YYYYMMDD 형식으로 포맷
  // const { roomID } = router.query; // 수정: roomID 변수명을 정확하게 변경
  const [loggedIn, setLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [uid, setUID] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log('로그인 상태: 로그인됨' + user.uid);
        console.log('roomID : ' + router.query.roomID);

        // 사용자 정보 가져오기
        const { uid } = user;
        setUID(uid);

        // 사용자 정보를 서버로 전송
        const pagePath = router.pathname;

        // Firebase에서 시간 가져오기
        async function fetchStudyTimeFromFirebase() {
          try {
            const uid = user.uid;
            const userDocRef = doc(collection(db, 'times'), uid);
            const dateDocRef = doc(collection(userDocRef, 'dates'), currentDate);
            const docSnapshot = await getDoc(dateDocRef);

            if (docSnapshot.exists()) {
              const { hours, minutes, seconds } = docSnapshot.data();
              setStudyTime({ hours, minutes, seconds });
            }
          } catch (error) {
            console.error('시간 가져오기 중 오류가 발생했습니다:', error);
          }
        }

        fetchStudyTimeFromFirebase();
      } else {
        console.log('로그인 상태: 로그인되지 않음');
        router.push('/startpage'); // 로그인되지 않은 경우 /startpage 페이지로 이동
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, currentDate, db, router.query.roomID]);


  // // 소켓 클라이언트 코드 시작점
  useEffect(() => {
    const socket = io.connect("http://localhost:4000");

    const auth = getAuth(firebase);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log("로그인 상태: 로그인됨" + user.uid);

        // 사용자 정보 가져오기
        const { uid } = user;
        setUID(uid);

        // 사용자 정보를 서버로 전송
        const pagePath = router.pathname;
        socket.emit("userConnected", { uid, pagePath });
      } else {
        setLoggedIn(false);
        console.log("로그인 상태: 로그인되지 않음");
      }
    });

    // 서버로부터 전달된 이메일 정보를 받아와서 상태 업데이트
    socket.on("userUID", (userUID) => {
      setUID(userUID);
    });

    return () => {
      unsubscribe();
    };
  }, [router.pathname]);
  // // 소켓 클라이언트 코드 끝

  return (
    <div className={styles.App}>
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

      <div className={styles.studyContainer}>
      <div className={styles.box}>
        
          <div className={styles.usersDiv}>
            <div className={styles.nickName}>유정은</div>
            <img
              src="/images/girl_longhair_desk_h.png"
              className={styles.desk_img}
              alt="Girl with long hair at the desk"
            />
          </div>
          <div className={styles.usersDiv}>
            <div className={styles.nickName}>유정은</div>
            <img
              src="/images/girl_shorthair_desk_h.png"
              className={styles.desk_img}
              alt="Girl with long hair at the desk"
            />
          </div>
          <div className={styles.usersDiv}>
            <div className={styles.nickName}>유정은</div>
            <img
              src="/images/boy_blackhair_desk_h.png"
              className={styles.desk_img}
              alt="Girl with long hair at the desk"
            />
          </div>
          <div className={styles.usersDiv}>
            <div className={styles.nickName}>유정은</div>
            <img
              src="/images/boy_brownhair_desk_h.png"
              className={styles.desk_img}
              alt="Girl with long hair at the desk"
            />
          </div>
          <div className={styles.usersDiv}>
            <div className={styles.nickName}>유정은</div>
            <img
              src="/images/girl_longhair_desk_h.png"
              className={styles.desk_img}
              alt="Girl with long hair at the desk"
            />
          </div>
          <div className={styles.usersDiv}>
            <div className={styles.nickName}>유정은</div>
            <img
              src="/images/girl_shorthair_desk_h.png"
              className={styles.desk_img}
              alt="Girl with long hair at the desk"
            />
          </div>
          <div className={styles.usersDiv}>
            <div className={styles.nickName}>유정은</div>
            <img
              src="/images/boy_blackhair_desk_h.png"
              className={styles.desk_img}
              alt="Girl with long hair at the desk"
            />
          </div>
          <div className={styles.usersDiv}>
            <div className={styles.nickName}>유정은</div>
            <img
              src="/images/boy_brownhair_desk_h.png"
              className={styles.desk_img}
              alt="Girl with long hair at the desk"
            />
          </div>
      </div>

        <div className={styles.timer}>
          <div className={styles.timer_title}>
            <img
              className={styles.timer_img}
              src="/images/timer.png"
            />
            <h1>Timer</h1>
          </div>
          <Timer studyTime={studyTime} setStudyTime={setStudyTime} />
        </div>


      </div>
    </div>
  );
}

export default Study;
