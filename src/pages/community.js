import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import logo from "../../public/images/logo.png";
import styles from "../styles/community.module.css";
import navStyles from "../styles/nav.module.css";
import Image from "next/image";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { io } from "socket.io-client";

const firebaseConfig = {
  // Firebase 프로젝트의 구성 정보를 입력하세요.
};
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // 나머지 Firebase 구성 옵션들...
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};
function Community() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [roomID, setRoomID] = useState("");
  const [roomIdError, setRoomIdError] = useState(false);
  const [missingFieldsError, setMissingFieldsError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [uid, setUID] = useState("");
  const [displayName, setDisplayName] = useState("");

  const router = useRouter();
  const modal = useRef(null);

  const auth = getAuth(firebase);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log("로그인 상태: 로그인됨" + user.uid);

        // 사용자 정보 가져오기
        const { uid } = user;
        setUID(uid);

        // 사용자 정보를 서버로 전송
        const pagePath = router.pathname;
        // socket.emit('userConnected', { displayName, email, pagePath });
      } else {
        setLoggedIn(false);
        console.log("로그인 상태: 로그인되지 않음");
      }
    });

    return () => unsubscribe();
  }, [auth, router.pathname]);

  // 현재 접속한 이메일 출력
  useEffect(() => {
    console.log("User uid in Community:", uid);
  }, [uid]);

  // modal
  const openModal = () => {
    setShowModal(true);
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 50) {
      setTitle(inputValue);
    }
  };

  const handleContentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 200) {
      setContent(inputValue);
    }
  };

  const wordCount = content.length;

  const handleRoomIDChange = (e) => {
    const inputValue = e.target.value;
    const englishRegex = /^[a-zA-Z0-9]*$/;
    if (englishRegex.test(inputValue) && inputValue.length <= 20) {
      setRoomIdError(false);
      setRoomID(inputValue);
    } else {
      setRoomIdError(true);
    }
  };

  // 게시물 작성
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "" || content.trim() === "" || roomID.trim() === "") {
      setMissingFieldsError(true);
      return;
    }

    const firestore = getFirestore();

    // 해당 roomID가 이미 Firestore에 존재하는지 확인
    const roomRef = doc(firestore, "posts", roomID);
    const roomDoc = await getDoc(roomRef);

    if (roomDoc.exists()) {
      // 이미 존재하는 roomID인 경우 오류 처리
      setRoomIdError(true);
      return;
    }

    const today = new Date();
    const year = today.getFullYear(); // 년도
    const month = today.getMonth() + 1; // 월
    const date = today.getDate(); // 날짜
    const datestr = `${year}/${month}/${date}`;

    await setDoc(doc(db, "posts", roomID), {
      title,
      content,
      roomID,
      date: datestr, // 날짜 저장
      timestamp: serverTimestamp(),
      nickname: nickname,
    });

    setTitle("");
    setContent("");
    setRoomID("");
    setRoomIdError(false);
    setMissingFieldsError(false);
    setShowModal(false);

    // Firestore에서 게시물 데이터 불러오기
    const postsCollectionRef = collection(db, "posts");
    const q = query(postsCollectionRef, orderBy("timestamp", "desc")); // 내림차순으로 정렬
    const querySnapshot = await getDocs(q);

    const updatedPosts = [];
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      updatedPosts.push(post);
    });

    setPosts(updatedPosts);
  };

  let today = new Date();
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜

  const datestr = year + "/" + month + "/" + date;

  useOnClickOutside(modal, () => {
    setShowModal(false);
  });

  // 컴포넌트가 마운트될 때 firebase/firestore posts 데이터를 가져와 posts 상태로 설정함
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "posts"), orderBy("timestamp", "desc"))
        );
        const data = querySnapshot.docs.map((doc) => doc.data());
        setPosts(data);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, []);

  const roomIDInputStyles = roomIdError ? `${styles.inputError}` : "";

  const createPost = (post) => {
    const handlePostClick = () => {
      router.push({
        pathname: `/study`,
        query: { roomID: post.roomID },
      });
    };

    return (
      <div className={styles.post} onClick={handlePostClick}>
        <h1 className={styles["post-title"]}>{post.title}</h1>
        <p className={styles["post-writer"]}>{post.nickname}</p>
        <p className={styles["post-date"]}>{datestr}</p>
        <p className={styles["post-content"]}>{post.content}</p>
      </div>
    );
  };

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

      <div className={styles["post-container"]}>
        <div className={styles.newPostContainer}>
          <div className={styles.newPost}>
            <button className={styles.newPostBtn} onClick={openModal}>
              POST
            </button>
          </div>
        </div>
        {posts.map((post, index) => (
          <React.Fragment key={index}>{createPost(post)}</React.Fragment>
        ))}
      </div>

      {typeof window !== 'undefined' && showModal && (
        <div className={styles.modal}>
          <form onSubmit={handleSubmit} className={styles.modalform}>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={handleTitleChange}
            />
            <textarea
              className={styles.textarea}
              placeholder="내용"
              value={content}
              onChange={handleContentChange}
            ></textarea>
            <span className={styles.counter}>({wordCount}/200)</span>
            <br />
            <div className={styles.roomIdContainer}>
              <input
                type="text"
                placeholder="스터디룸 ID"
                value={roomID}
                onChange={handleRoomIDChange}
                className={roomIDInputStyles}
              />
              {roomIdError && (
                <p className={styles.errorMessage}>
                  * 해당 스터디룸 ID는 이미 존재합니다.
                </p>
              )}
              {missingFieldsError && (
                <p className={styles.errorMessage}>* 필수 항목을 입력하세요.</p>
              )}
            </div>
            <button type="submit" className={styles.submitBtn}>
              등록
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Community;
