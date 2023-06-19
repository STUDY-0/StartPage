import firebase from '../../firebase';
import styles from '../styles/study.module.css';
import React, { useState, useEffect } from 'react';
import Timer from '../../src/Timer';
import navStyles from '../styles/nav.module.css';
import Image from 'next/image';
import logo from '../../public/images/logo.png';
import firebase from 'firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

function Study() {
  const router = useRouter();
  const db = getFirestore();
  const auth = getAuth();
  const currentDate = format(new Date(), 'yyyyMMdd'); // 현재 날짜를 YYYYMMDD 형식으로 포맷
  const { roomID } = router.query; // 수정: roomID 변수명을 정확하게 변경

  const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('로그인 상태: 로그인됨' + user.uid);
        console.log('roomID : ' + router.query.roomId);

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
  }, [auth, currentDate, db, router, roomID]);

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
