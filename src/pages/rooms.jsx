import { useRouter } from 'next/router';
import Community from './community';
import Study from './study';

function App() {
  const router = useRouter();

  // 라우팅에 따라 컴포넌트를 렌더링
  const renderComponent = () => {
    const { pathname } = router;

    if (pathname === '/study') {
      return <Study />;
    }

    // 기본적으로 Community 컴포넌트를 렌더링
    return <Community />;
  };

  return <>{renderComponent()}</>;
}

export default App;
