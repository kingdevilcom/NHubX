import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';

import { ProjectProvider, useProject } from './context/ProjectContext';
import { AdminProvider } from './context/AdminContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import WebPreviewModal from './components/WebPreviewModal';
import FireParticles from './components/FireParticles';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Developer from './pages/Developer';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ScrollToTop from './components/ScrollToTop';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />

        <Route
          path="/about"
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          }
        />

        <Route
          path="/projects"
          element={
            <PageWrapper>
              <Projects />
            </PageWrapper>
          }
        />

        <Route
          path="/developer"
          element={
            <PageWrapper>
              <Developer />
            </PageWrapper>
          }
        />

        <Route
          path="/contact"
          element={
            <PageWrapper>
              <Contact />
            </PageWrapper>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <PageWrapper>
              <PrivacyPolicy />
            </PageWrapper>
          }
        />

        <Route
          path="/terms-and-conditions"
          element={
            <PageWrapper>
              <TermsAndConditions />
            </PageWrapper>
          }
        />

        <Route
          path="/admin"
          element={
            isAdminRoute ? (
              <Admin />
            ) : (
              <PageWrapper>
                <Admin />
              </PageWrapper>
            )
          }
        />

        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function AppContent() {
  const { isPreviewOpen, previewUrl, closePreview } =
    useProject();

  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  const isAdminRoute = location.pathname === '/admin';

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen text-white flex flex-col"
        >
          <FireParticles zIndex={1} />

          {!isAdminRoute && <Navbar />}

          <main className="flex-grow relative z-10">
            <AnimatedRoutes />
          </main>

          {!isAdminRoute && <Footer />}
        </motion.div>
      )}

      <WebPreviewModal
        isOpen={isPreviewOpen}
        url={previewUrl}
        onClose={closePreview}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <ProjectProvider>
        <AdminProvider>
          <AppContent />
        </AdminProvider>
      </ProjectProvider>
    </Router>
  );
}

export default App;
