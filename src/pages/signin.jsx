import React, { useState, useEffect, useRef } from 'react';
import { getAuth, signInWithEmailAndPassword, AuthErrorCodes, onAuthStateChanged } from 'firebase/auth';
// import firebaseApp from '../../firebase';
import styles from '../styles/signin.module.css';
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import firebaseApp from "@/net/firebaseApp";
import db from "@/net/db";
import auth from "@/net/auth";

const app = firebaseApp;

function Signin() {
  const inputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [windowWidth, setWindowWidth] = useState();
  const router = useRouter();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSignIn();
    }
  };

  // 반응형
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const placeholders = windowWidth <= 768 ? ['이메일', '비밀번호'] : ['', ''];

  const handleSignIn = () => {
    if (email === '' || password === '') {
      let errorMessage = "빈 칸 없이 작성해주세요.";

      Swal.fire({
        title: "로그인 실패",
        html: errorMessage,
        showCancelButton: false,
        confirmButtonText: "확인",
        icon: 'warning',
      });
    } else {
      // const auth = getAuth(firebaseApp);

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          Swal.fire({
            title: "로그인 성공",
            html: `
              로그인에 성공했습니다.
            `,
            showCancelButton: false,
            confirmButtonText: "확인",
            icon: 'success',
          });
          router.push(`/mypage`);
        })
        .catch((error) => {
          console.error('Sign-in error:', error);
          const errorCode = error.code;
          let errorMessage = '';

          switch (errorCode) {
            case AuthErrorCodes.INVALID_EMAIL:
              errorMessage = '유효하지 않은 이메일 형식입니다.';
              break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.';
              break;
            default:
              errorMessage = '로그인에 실패했습니다.';
              break;
          }

          Swal.fire({
            title: "로그인 실패",
            html: errorMessage,
            showCancelButton: false,
            confirmButtonText: "확인",
            icon: 'warning',
          });
        });
    }
  };

  const goToSignup = () => {
    router.push('/signup');
  }

  const goToStartPage = () => {
    router.push('/startpage');
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>sign in</div>
        <div className={styles.flex}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>이메일</label>
            <input
              className={styles.input}
              ref={inputRef}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[0]}
            />
          </div>
          <div className={styles.inputDiv}>
            <label className={styles.label}>비밀번호</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[1]}
            />
          </div>
        </div>
        <button className={styles.register} onClick={handleSignIn}>
          next
        </button>
        <div className={styles.links}>
          <div className={styles.goToSignup} onClick={goToStartPage}>홈</div>
          <div className={styles.goToSignup} onClick={goToSignup}>회원가입</div>
        </div>

      </div>
    </>
  );
}

export default Signin;
