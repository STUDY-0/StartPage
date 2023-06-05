import React, { useState } from 'react';
import logo from '../../public/logo.png';
import styles from '../styles/community.module.css';
import navStyles from '../styles/nav.module.css';
import Image from 'next/image';

function Community() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [roomID, setRoomID] = useState('');

  const openModal = () => {
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission (e.g., send data to a server)
    // You can access the entered title and content from the title and content state variables
    // Reset the title and content state variables
    setTitle('');
    setContent('');
    setRoomID('');
    // Close the modal
    setShowModal(false);
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
    // Restrict input to English characters only
    const englishRegex = /^[a-zA-Z0-9]*$/;
    if (englishRegex.test(inputValue) && inputValue.length <= 20) {
      setRoomID(inputValue);
    }
  };


  return (
    <div className={styles.App}>
      <nav className={navStyles.nav}>
        <div className={navStyles['nav-container']}>
          <a className={navStyles.logo} href="/">
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

      <div className={styles['post-container']}>
        <div className={styles.newPostContainer}>
          <div className={styles.newPost}>
            <button className={styles.newPostBtn} onClick={openModal}>
              POST
            </button>
          </div>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>React 스터디 하실 분 ~</h1>
          <p className={styles['post-writer']}>Hyewon Yang</p>
          <p className={styles['post-date']}>2023 / 03 / 31</p>
          <p className={styles['post-content']}>
            저랑 같이 react 공부해요 ㅎㅎ 저는 미림 마이스터고 출신이고 같이
            공부해서 취뽀해염
          </p>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>ditto</h1>
          <p className={styles['post-writer']}>newjeans</p>
          <p className={styles['post-date']}>2323 / 13 / 01</p>
          <p className={styles['post-content']}>
            likeyouwantsomebody너를상상햇지항상닿아있던처음느낌그대로난
          </p>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>ditto</h1>
          <p className={styles['post-writer']}>newjeans</p>
          <p className={styles['post-date']}>2323 / 13 / 01</p>
          <p className={styles['post-content']}>
            likeyouwantsomebody너를상상햇지항상닿아있던처음느낌그대로난
          </p>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>ditto</h1>
          <p className={styles['post-writer']}>newjeans</p>
          <p className={styles['post-date']}>2323 / 13 / 01</p>
          <p className={styles['post-content']}>
            likeyouwantsomebody너를상상햇지항상닿아있던처음느낌그대로난
          </p>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <form onSubmit={handleSubmit}>
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
            <span className={styles.counter}>({wordCount}/200)</span><br></br>
            <input
              type="text"
              placeholder="스터디룸 ID"
              value={roomID}
              onChange={handleRoomIDChange}
            />
            <div className={styles.buttonContainer}>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Community;