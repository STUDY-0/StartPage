import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import logo from "../../public/images/logo.png";
import styles from "../styles/community.module.css";
import navStyles from "../styles/nav.module.css";
import Image from "next/image";
import firebase from 'firebase/compat/app';
import db from "../net/db";
import {
  getDocs,
  collection,
  query,
  orderBy,
  setDoc,
  serverTimestamp,
} from "firebase/compat/firestore";  // Updated import path
import { doc, getDoc } from "firebase/compat/firestore";  // Updated import path
import { getAuth, onAuthStateChanged } from "firebase/compat/auth";  // Updated import path
import io from "socket.io-client";

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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [roomID, setRoomID] = useState('');
  const [roomIdError, setRoomIdError] = useState(false);
  const [missingFieldsError, setMissingFieldsError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  const router = useRouter();
  const modal = useRef(null);

  const auth = getAuth(firebase);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        console.log('로그인 상태: 로그인됨' + user.uid);

        // 사용자 정보 가져오기
        const { displayName, email } = user;
        setNickname(displayName); // 사용자의 displayName을 nickname으로 설정
        setEmail(email);

        // 사용자 정보를 서버로 전송
        const pagePath = router.pathname;
        // socket.emit('userConnected', { displayName, email, pagePath });
      } else {
        setLoggedIn(false);
        console.log('로그인 상태: 로그인되지 않음');
      }
    });

    return () => unsubscribe();
  }, [auth, router.pathname]);

  // 현재 접속한 이메일 출력
  useEffect(() => {
    console.log('User email in Community:', email);
  }, [email]);

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
    const englishRegex = /^[a-zA-Z0-9_-]*$/;

    if (englishRegex.test(inputValue)) {
      setRoomID(inputValue);
      setRoomIdError(false);
    } else {
      setRoomID('');
      setRoomIdError(true);
    }
  };

  const handleCreateRoom = async () => {
    if (!title || !content || !roomID) {
      setMissingFieldsError(true);
      return;
    }

    setMissingFieldsError(false);

    // Create room in Firebase
    const roomsCollection = collection(db, 'rooms');
    const newRoomDocRef = await setDoc(doc(roomsCollection, roomID), {
      title,
      content,
      createdAt: serverTimestamp(),
    });

    console.log('New room created:', newRoomDocRef.id);

    // Redirect to the new room
    router.push(`/rooms/${roomID}`);
  };

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, 'posts');
      const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map((doc) => doc.data());
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  useOnClickOutside(modal, () => setShowModal(false));

  return (
    <div className={styles.container}>
      <nav className={navStyles.nav}>
        <div className={navStyles.logo}>
          <Image src={logo} alt="Logo" />
        </div>
        <div>
          {loggedIn ? (
            <div className={navStyles.loggedInContainer}>
              <p className={navStyles.loggedInUser}>{nickname}</p>
              <button
                className={navStyles.logoutButton}
                onClick={() => firebase.auth().signOut()}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className={navStyles.loginContainer}>
              <button
                className={navStyles.loginButton}
                onClick={() => router.push('/login')}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className={styles.main}>
        <h1>Welcome to the Community</h1>
        {loggedIn && (
          <div>
            <button className={styles.createButton} onClick={openModal}>
              Create Room
            </button>
          </div>
        )}

        {showModal && (
          <div ref={modal} className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Create a New Room</h2>
              {missingFieldsError && (
                <p className={styles.error}>Please fill in all fields</p>
              )}
              <div>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>
              <div>
                <label htmlFor="content">Content:</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={handleContentChange}
                />
                <p className={styles.wordCount}>{wordCount}/200</p>
              </div>
              <div>
                <label htmlFor="roomID">Room ID:</label>
                <input
                  type="text"
                  id="roomID"
                  value={roomID}
                  onChange={handleRoomIDChange}
                />
                {roomIdError && (
                  <p className={styles.error}>
                    Room ID can only contain letters, numbers, hyphens, and
                    underscores
                  </p>
                )}
              </div>
              <button className={styles.createRoomButton} onClick={handleCreateRoom}>
                Create Room
              </button>
            </div>
          </div>
        )}

        <div className={styles.postList}>
          {posts.map((post) => (
            <div key={post.id} className={styles.post}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Created at: {post.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community;
