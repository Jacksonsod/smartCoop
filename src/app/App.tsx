import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CooperativeProvider } from '../context/CooperativeContext';
import router from './router';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CooperativeProvider>
        <RouterProvider router={router} />
      </CooperativeProvider>
    </AuthProvider>
  );
};

export default App;
