import { useState, useEffect, useRef } from "react";
import styles from './styles/study.module.css';
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";
import firebase from '../firebase';

// Firebase 초기화 및 Firestore 인스턴스 설정
const db = getFirestore();
const auth = getAuth();

function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const timeRef = useRef(null);
  const uid = auth.currentUser?.uid;
  const currentDate = format(new Date(), "yyyyMMdd"); // 현재 날짜를 YYYYMMDD 형식으로 포맷
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const seconds = prevTime.seconds + 1;
          const minutes = prevTime.minutes + Math.floor(seconds / 60);
          const hours = prevTime.hours + Math.floor(minutes / 60);
          return {
            hours: hours,
            minutes: minutes % 60,
            seconds: seconds % 60,
          };
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      if (!isRunning) {
        handleStopTimer(); // 컴포넌트 언마운트 시 타이머 종료 및 저장 로직 호출
      }
    };
  }, [isRunning]);

  useEffect(() => {
    async function fetchTimeFromFirebase() {
      try {
        const userDocRef = doc(collection(db, "times"), uid);
        const dateDocRef = doc(collection(userDocRef, "dates"), currentDate);
        const docSnapshot = await getDoc(dateDocRef);

        if (docSnapshot.exists()) {
          const { hours, minutes, seconds } = docSnapshot.data();
          setTime({ hours, minutes, seconds }); // 시간 설정
        }
      } catch (error) {
        console.error("시간 가져오기 중 오류가 발생했습니다:", error);
      }
    }

    if (uid && currentDate) {
      fetchTimeFromFirebase();
    }
  }, [uid, currentDate]);

  async function saveTimeToFirebase() {
    try {
      const timeToSave = time;
      const userDocRef = doc(collection(db, "times"), uid);
      const dateDocRef = doc(collection(userDocRef, "dates"), currentDate);
      await setDoc(dateDocRef, timeToSave); // 타이머 데이터를 문서에 저장

      console.log("시간이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("시간 저장 중 오류가 발생했습니다:", error);
    }
  }

  const handleStartTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      console.log("타이머가 시작되었습니다.");

      
    }
  };

  const handleStopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      saveTimeToFirebase(); // 타이머 종료 시 Firebase에 시간 저장
      console.log("타이머가 종료되었습니다.");
    }
  };

  return (
    <div>
      <p className={isRunning ? styles.colorTimer : null}>
        {time.hours < 10 ? "0" + time.hours : time.hours}:
        {time.minutes < 10 ? "0" + time.minutes : time.minutes}:
        {time.seconds < 10 ? "0" + time.seconds : time.seconds}
      </p>
      <button className={styles.btnStart} onClick={handleStartTimer}>시작</button>
      <button className={styles.btnSave} onClick={handleStopTimer}>종료</button>
    </div>
  );
}

export default Timer;