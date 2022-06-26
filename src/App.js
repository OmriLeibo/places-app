import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/AuthContext';
import LoadingSpinner from './shared/FormElements/LoadingSpinner';
import { useAuth } from './shared/hooks/auth-hook';

const UsersPage = lazy(() => import('./users/pages/UsersPage'));
const NewPlace = lazy(() => import('./places/pages/NewPlace'));
const UsersPlaces = lazy(() => import('./places/pages/UsersPlaces'));
const UpdatePlace = lazy(() => import('./places/pages/UpdatePlace'));
const Authenticate = lazy(() => import('./users/pages/Authenticate'));

const App = () => {
  const { token, login, logout, userId } = useAuth();
  let routes;
  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/:userId/places" element={<UsersPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />

        <Route path="/places/:placeId" element={<UpdatePlace />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/:userId/places" element={<UsersPlaces />} />

        <Route path="/auth" element={<Authenticate />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
          {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
