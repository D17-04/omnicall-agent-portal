import React, { useState } from 'react';
import { CallCenterProvider, useCallCenter } from './context/CallCenterContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ActiveCallPage } from './pages/ActiveCallPage';
import { HistoryPage } from './pages/HistoryPage';
import { QueueList } from './components/queue/QueueList';
import { Layout } from './components/layout/Layout';
import { NavTab } from './components/layout/Navigation';

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useCallCenter();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && (
        <DashboardPage
          onNavigateToQueue={() => setActiveTab('queue')}
          onNavigateToActiveCall={() => setActiveTab('active-call')}
          onNavigateToHistory={() => setActiveTab('history')}
        />
      )}

      {activeTab === 'queue' && (
        <QueueList onGoToActiveCall={() => setActiveTab('active-call')} />
      )}

      {activeTab === 'active-call' && (
        <ActiveCallPage
          onGoToQueue={() => setActiveTab('queue')}
          onGoToDashboard={() => setActiveTab('dashboard')}
        />
      )}

      {activeTab === 'history' && <HistoryPage />}
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <CallCenterProvider>
      <MainAppContent />
    </CallCenterProvider>
  );
};

export default App;

