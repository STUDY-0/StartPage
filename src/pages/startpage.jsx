import React from "react";
import styles from '../styles/startpage.module.css'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import firebase from '../../firebase'
import firebaseApp from "@/net/firebaseApp";
import db from "@/net/db";
import auth from "@/net/auth";

const app = firebaseApp;

function StartPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);


  return (
    <>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src="/images/logo.png" />
      </div>
      <div className={styles.core}>
        <div className={styles.img1}>
          <img className={styles.img} src="/images/girl_shorthair.png" alt="g1" />
          <img className={styles.img} src="/images/boy_brownhair.png" alt="b1" />
        </div>
        <div className={styles.btns}>
          <button className={styles.btnSignIn}
            onClick={() => { router.push(`/signin`) }}>
            sign in
          </button>
          <button className={styles.btnSignUp}
            onClick={() => { router.push(`/signup`) }}>
            sign up
          </button>
        </div>
        <div className={styles.img2}>
          <img className={styles.img} src="/images/girl_longhair.png" alt="b2" />
          <img className={styles.img} src="/images/boy_blackhair.png" alt="g2" />
        </div>
      </div>
    </>
  );
}

export default StartPage;
