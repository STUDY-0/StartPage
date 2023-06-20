import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
// import firebase from '../../firebase';
import { doc, getFirestore, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import styles from '../styles/characters.module.css';
import Swal from 'sweetalert2';
import firebaseApp from "@/net/firebaseApp";
import db from "@/net/db";
import auth from "@/net/auth";

const app = firebaseApp;

function Characters() {
    const router = useRouter();
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    // 페이지 로드 시 로그인 상태 확인
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const chkChar = () => {
        Swal.fire({
            title: "해당 캐릭터를 선택하시겠나요?",
            confirmButtonText: "확인",
            cancelButtonText: "취소",
            showCancelButton: true,
            icon: 'question',
        }).then(result => {
            if (result.isConfirmed) {
                handleSubmit();
            }
        })

    }

    // 버튼 누르면 실행
    const handleSubmit = async () => {
        console.log('Selected Character ID:', selectedCharacter);
        if (selectedCharacter === null) {
            Swal.fire({
                title: "캐릭터를 선택해주세요!",
                showCancelButton: false,
                confirmButtonText: "확인",
                icon: 'warning',
            })
            return 0;
        }

        // Firestore에 사용자 정보 업데이트
        try {
            const auth = getAuth(app);
            const user = auth.currentUser;

            if (!user) {
                console.log('사용자가 로그인되어 있지 않습니다.');
                return;
            }

            const firestore = getFirestore(app);
            const userId = user.uid;

            const userDocRef = doc(firestore, 'users', userId);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                await updateDoc(userDocRef, {
                    characterId: selectedCharacter,
                });
                console.log('캐릭터 정보가 성공적으로 업데이트되었습니다.');
                router.push(`/mypage`);
                Swal.fire({
                    title: "캐릭터 저장",
                    html: `
                    캐릭터를 성공적으로 저장했습니다.
                    `,
                    showCancelButton: false,
                    confirmButtonText: "확인",
                    icon: 'success',
                })
                
            } else {
                await setDoc(userDocRef, {
                    characterId: selectedCharacter,
                });
                router.push(`/mypage?userId=${user.uid}`);
                console.log('사용자 문서가 생성되었고, 캐릭터 정보가 성공적으로 업데이트되었습니다.');
                Swal.fire({
                    title: "캐릭터 저장",
                    html: `
                    캐릭터를 성공적으로 저장했습니다.
                    `,
                    showCancelButton: false,
                    confirmButtonText: "확인",
                    icon: 'success',
                })
            }
        } catch (error) {
            console.log('캐릭터 정보 업데이트 중 오류가 발생했습니다:', error);
        }
    };

    // 캐릭터 선택하면 style 변경, select visible
    const selectVisible = (id) => {
        let selects = document.getElementsByClassName(styles.select); // 클래스명으로 선택
        let selected = document.getElementsByClassName(id)[0];
        let img = document.getElementById(id);
        let imgs = document.getElementsByClassName(styles.imgs); // 클래스명으로 선택
        for (let i = 0; i < selects.length; i++) {
            selects[i].style.visibility = "hidden";
            imgs[i].style.backgroundColor = "transparent";
            imgs[i].style.boxShadow = "none";
        }

        img.style.backgroundColor = "#FDD0D0";
        img.style.boxShadow = "0 0 0 3px #FFA8A8 inset";
        selected.style.visibility = "visible";
        setSelectedCharacter(id);
    };


    return (
        <div className={styles.container}>
            <div className={styles.divNontitle}>
            <div className={styles.title}>characters</div>
                <div className={styles.charactersDiv}>
                    <div className={styles.imgSelectDiv}>
                        <img
                            className={styles.imgs}
                            id='boy_blackhair'
                            src="/images/boy_blackhair.png"
                            alt="boy_blackhair"
                            onClick={() => selectVisible("boy_blackhair")}
                        />
                        <div className={`${styles.select} boy_blackhair`}>select</div>
                    </div>
                    <div className={styles.imgSelectDiv}>
                        <img
                            className={styles.imgs}
                            id="boy_brownhair"
                            src='/images/boy_brownhair.png'
                            alt="boy_brownhair"
                            onClick={() => selectVisible("boy_brownhair")}
                        />
                        <div className={`${styles.select} boy_brownhair`}>select</div>
                    </div>
                    <div className={styles.imgSelectDiv}>
                        <img
                            className={styles.imgs}
                            id="girl_shorthair"
                            src='/images/girl_shorthair.png'
                            alt="girl_shorthair"
                            onClick={() => selectVisible("girl_shorthair")}
                        />
                        <div className={`${styles.select} girl_shorthair`}>select</div>
                    </div>
                    <div className={styles.imgSelectDiv}>
                        <img
                            className={styles.imgs}
                            id="girl_longhair"
                            src='/images/girl_longhair.png'
                            alt="girl_longhair"
                            onClick={() => selectVisible("girl_longhair")}
                        />
                        <div className={`${styles.select} girl_longhair`}>select</div>
                    </div>
                </div>
                <button className={styles.register} onClick={chkChar}>submit</button>
            </div>
        </div>
    );
}

export default Characters;
