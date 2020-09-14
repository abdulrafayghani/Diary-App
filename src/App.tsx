import React, { FC, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DiaryEntriesList from './features/diary/DiaryEntriesList';
import { rootState } from './rootReducer';

const Auth = lazy(() => import('./features/auth/Auth'))
const Home = lazy(() => import('./features/home/Home'))

const App: FC = () => {
  const isLoggedIn = useSelector( (state: rootState) => state.auth.isAuthenticated )
  
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Suspense fallback={<p>...Loading</p>}>
            {isLoggedIn ? <Home /> : <Auth />}
          </Suspense>
          <Route path='/diary/:id'><DiaryEntriesList/></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
