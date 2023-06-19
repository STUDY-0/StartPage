import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import logo from "../../public/images/logo.png";
import styles from "../styles/study.module.css";
import navStyles from "../styles/nav.module.css";
import Image from "next/image";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import { io } from "socket.io-client";

const firebaseConfig = {
  // Firebase 프로젝트의 구성 정보를 입력하세요.
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function Study() {
  const router = useRouter();
  const currentDate = format(new Date(), "yyyyMMdd");
  const [loggedIn, setLoggedIn] = useState(false);
  const [uid, setUID] = useState("");
  const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log("로그인 상태: 로그인됨" + user.uid);
        console.log("roomID : " + router.query.roomID);

        const { uid } = user;
        setUID(uid);

        async function fetchStudyTimeFromFirebase() {
          try {
            const userDocRef = doc(collection(db, "times"), uid);
            const dateDocRef = doc(collection(userDocRef, "dates"), currentDate);
            const docSnapshot = await getDoc(dateDocRef);

            if (docSnapshot.exists()) {
              const { hours, minutes, seconds } = docSnapshot.data();
              setStudyTime({ hours, minutes, seconds });
            }
          } catch (error) {
            console.error("시간 가져오기 중 오류가 발생했습니다:", error);
          }
        }

        fetchStudyTimeFromFirebase();
      } else {
        console.log("로그인 상태: 로그인되지 않음");
        router.push("/startpage");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, currentDate, db, router.query.roomID]);

  useEffect(() => {
    const socket = io.connect("http://localhost:4000");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log("로그인 상태: 로그인됨" + user.uid);

        const { uid } = user;
        setUID(uid);

        const pagePath = router.pathname;
        socket.emit("userConnected", { uid, pagePath });
      } else {
        setLoggedIn(false);
        console.log("로그인 상태: 로그인되지 않음");
      }
    });

    socket.on("userUID", (userUID) => {
      setUID(userUID);
    });

    return () => {
      unsubscribe();
    };
  }, [router.pathname]);

  return (
    <div className={styles.App}>
      <nav className={navStyles.nav}>
        <div className={navStyles["nav-container"]}>
          <a className={navStyles.logo} href="/community">
            <Image className={navStyles["logo-img"]} src={logo} alt="Logo" />
          </a>
          <ul className={navStyles["nav-list"]}>
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
          {/* 나머지 사용자 정보 요소들 */}
        </div>

        <div className={styles.timer}>
          <div className={styles.timer_title}>
            <img className={styles.timer_img} src="/images/timer.png" />
            <h1>Timer</h1>
          </div>
          {/* Timer 컴포넌트 */}
        </div>
      </div>
    </div>
  );
}

export default Study;
