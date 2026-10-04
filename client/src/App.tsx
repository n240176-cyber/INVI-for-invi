/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InviProvider, useInvi } from './context/InviContext';
import { AppHeader, CurrentView } from './components/common/AppHeader';
import { LandingPage } from './pages/LandingPage';
import { CoordinatorPage } from './pages/CoordinatorPage';
import { InvigilatorPage } from './pages/InvigilatorPage';
import { LiveBoardPage } from './pages/LiveBoardPage';

const AppContent: React.FC = () => {
  const { state } = useInvi();
  const [currentView, setCurrentView] = useState<CurrentView>('landing');

  // Sync hash routing so users can bookmark #coordinator, #invigilator, #live
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'coordinator') {
        setCurrentView('coordinator');
      } else if (hash === 'invigilator') {
        setCurrentView('invigilator');
      } else if (hash === 'live') {
        setCurrentView('live');
      } else if (hash === 'overview' || hash === '') {
        setCurrentView('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: CurrentView) => {
    setCurrentView(view);
    if (view === 'landing') {
      window.location.hash = '';
    } else {
      window.location.hash = view;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] flex flex-col font-sans text-[#1C1C21]">
      <AppHeader
        currentView={currentView}
        onNavigate={handleNavigate}
        sensorConnected={state.sensorConnected}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onSelectRole={handleNavigate}
            sensorConnected={state.sensorConnected}
          />
        )}
        {currentView === 'coordinator' && <CoordinatorPage />}
        {currentView === 'invigilator' && <InvigilatorPage />}
        {currentView === 'live' && <LiveBoardPage />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <InviProvider>
      <AppContent />
    </InviProvider>
  );
}
