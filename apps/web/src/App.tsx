import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { InboxPage } from './pages/inbox/InboxPage';
import { TeamPage } from './pages/team/TeamPage';
import { ContactsPage } from './pages/contacts/ContactsPage';
import { PipelinePage } from './pages/pipeline/PipelinePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProtectedRoute } from './auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <AppShell>
              <Routes>
                <Route path="/" element={<Navigate to="/inbox" replace />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/pipeline" element={<PipelinePage />} />
                <Route path="/team" element={<TeamPage />} />
              </Routes>
            </AppShell>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
