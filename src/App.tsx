import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { LoadingScreen } from './pages/LoadingScreen';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WelcomeIntro } from './pages/WelcomeIntro';
import { HomePage } from './pages/HomePage';
import { MissionsPage } from './pages/MissionsPage';
import { MissionRunnerPage } from './pages/MissionRunnerPage';
import { LearnPage } from './pages/LearnPage';
import { BadgesPage } from './pages/BadgesPage';
import { ProgressPage } from './pages/ProgressPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { LevelUpModal } from './components/LevelUpModal';
import { AICoachModal } from './components/AICoachModal';

const ProtectedLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b14] flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-xs animate-pulse">
          Calibrating Guardian defense grid...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050b14] cyber-grid flex flex-col text-slate-100">
      <Header />
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Navbar onOpenAICoach={() => setIsAICoachOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-5xl mx-auto w-full overflow-x-hidden">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/missions/:missionId" element={<MissionRunnerPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>

      {/* Celebratory Level-Up Modal */}
      <LevelUpModal />

      {/* Floating AI Cyber Coach Modal */}
      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
      />
    </div>
  );
};

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false);

  if (!initialLoadingComplete) {
    return <LoadingScreen onComplete={() => setInitialLoadingComplete(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b14] flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-xs animate-pulse">
          Calibrating Guardian defense grid...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <LoginPage />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/home" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/home" replace /> : <RegisterPage />}
      />
      <Route
        path="/welcome"
        element={user ? <WelcomeIntro /> : <Navigate to="/login" replace />}
      />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RootNavigator />
      </BrowserRouter>
    </AuthProvider>
  );
}
