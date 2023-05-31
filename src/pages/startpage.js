import React from "react";
import styles from '../styles/startpage.module.css'

function StartPage() {
  return (
    <>
      <h1 className={styles.title}>STUDY-0</h1>
      <div className={styles.core}>
        <div className={styles.img1}>
          <img className={styles.img} src="/images/girl_shorthair.png" alt="g1"/>
          <img className={styles.img} src="/images/boy_brownhair.png" alt="b1"/>
        </div>
        <div className={styles.btns}>
          <button className={styles.btnSignIn} onClick={() => { window.location.href = './signIn.html' }}>
            sign in
          </button>
          <button className={styles.btnSignUp} onClick={() => { window.location.href = './signUp.html' }}>
            sign up
          </button>
        </div>
        <div className={styles.img2}>
          <img className={styles.img} src="/images/girl_longhair.png" alt="b2"/>
          <img className={styles.img}src="/images/boy_blackhair.png" alt="g2"/>
        </div>
      </div>
    </>
  );
}

export default StartPage;
