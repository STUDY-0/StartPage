import React, { useRef, useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import styles from "../styles/signup.module.css";
// import firebaseApp from "../../firebase";
import { useRouter } from "next/router";
import Swal from "sweetalert2"
import firebaseApp from "@/net/firebaseApp";
import db from "@/net/db";
import auth from "@/net/auth";

const app = firebaseApp;

function signup() {
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [nickname, setNickname] = useState("");
  const [windowWidth, setWindowWidth] = useState();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  // 반응형
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const placeholders = windowWidth <= 768 ? ["이메일", "닉네임", "비밀번호", "비밀번호 확인"] : ["", "", "", ""];

  // input창에서 enter키 누르면 next 버튼 호출
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleRegisterClick();
    }
  };

  const handleRegisterClick = () => {
    let chkpw = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (email === '' || nickname === '' || password === '' || passwordConfirmation === '') {
      let errorMessage = ("빈 칸 없이 작성해주세요.")

      Swal.fire({
        title: "회원가입 실패",
        html: errorMessage,
        showCancelButton: false,
        confirmButtonText: "확인",
        icon: 'warning',
      })
      return;
    }

    // if(!chkpw.test(password)) {
    //   alert("최소 8자, 하나 이상의 문자와 숫자를 사용해주세요.")
    //   return;
    // }

    // 비밀번호 일치 여부 확인
    if (password !== passwordConfirmation) {
      let errorMessage = ('비밀번호가 일치하지 않습니다.');
      Swal.fire({
        title: "회원가입 실패",
        html: errorMessage,
        showCancelButton: false,
        confirmButtonText: "확인",
        icon: 'warning',
      })
      return;
    }

    // auth 생성
    // const auth = getAuth(firebaseApp);

    // 유저 생성
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        updateProfile(auth.currentUser, {
          displayName: nickname
        })
          .then(() => {
            console.log(result.user);
            Swal.fire({
              title: "회원가입 성공!",
              html: `
              회원가입에 성공했습니다.
              `,
              showCancelButton: false,
              confirmButtonText: "확인",
              icon: 'success',
            })
            router.push(`/characters?userId=${result.user.uid}`);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      // 유저 생성 중 에러 발생
      .catch((error) => {
        let errorMessage = '';

        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = ('유효하지 않은 이메일 형식입니다.');
            break;
          case 'auth/email-already-in-use':
            errorMessage = ('이미 가입되어 있는 계정입니다.');
            break;
          default:
            errorMessage = alert(error);
            break;
        }

        Swal.fire({
          title: "회원가입 실패",
          html: errorMessage,
          showCancelButton: false,
          confirmButtonText: "확인",
          icon: 'warning',
        })
      });
  };

  const goToSignin = () => {
    router.push('/signin');
  }

  const goToStartPage = () => {
    router.push('/startpage');
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>sign up</div>
        <div className={styles.flex}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>이메일</label>
            <input className={styles.input}
              ref={inputRef}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[0]}
            />
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.label}>닉네임</label>
            <input className={styles.input}
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[1]}
            />
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.label}>비밀번호</label>
            <input className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[2]}
            />
          </div>
          <div className={styles.message}>* 비밀번호는 최소 8자, 하나 이상의 문자와 하나의 숫자를 사용해주세요.</div>
          <div className={styles.inputDiv}>
            <label className={styles.label}>비밀번호 확인</label>
            <input className={styles.input}
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[3]}
            />
          </div>
        </div>
        <button className={styles.register} onClick={handleRegisterClick}>
          next
        </button>
        <div className={styles.links}>
          <div className={styles.goToSignin} onClick={goToStartPage}>홈</div>
          <div className={styles.goToSignin} onClick={goToSignin}>로그인</div>
        </div>
      </div>
    </>
  );
}

export default signup;
