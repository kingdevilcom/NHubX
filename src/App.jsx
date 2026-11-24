import { lazy, Suspense, useCallback, useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { AnimatePresence, motion, MotionConfig } from 'framer-motion';

import { ProjectProvider, useProject } from './context/ProjectContext';
import { ContentProvider } from './context/ContentContext';
import { trackLeadSourceEvent, trackPageView } from './firebase';
import { captureLeadVisit } from './leadSource';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import WebPreviewModal from './components/WebPreviewModal';
import FireParticles from './components/FireParticles';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
const About = lazy(() => import('./pages/About.jsx'));
const CustomerOrders = lazy(() => import('./pages/CustomerOrders.jsx'));
const ServiceBusinessWebsites = lazy(() => import('./pages/ServiceBusinessWebsites.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Developer = lazy(() => import('./pages/Developer.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions.jsx'));

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

function PageLoading() {
  return (
    <div role="status" aria-label="Loading page" className="flex min-h-[50vh] items-center justify-center">
      <span aria-hidden="true" className="h-10 w-10 rounded-full border-2 border-white/10 border-t-nhubx-glow-primary motion-safe:animate-spin" />
    </div>
  );
}

const AnimatedRoutes = ({ startupComplete }) => {
  const location = useLocation();

  const isAdminRoute = location.pathname === '/admin';

  return (
    <AnimatePresence mode="wait">
      <Routes
        location={location}
        key={location.pathname}
      >

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

        <Route path="/websites-for-service-businesses" element={<PageWrapper><ServiceBusinessWebsites /></PageWrapper>} />
        <Route path="/orders" element={<PageWrapper><CustomerOrders /></PageWrapper>} />

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
          path="/pricing"
          element={
            <PageWrapper>
              <Pricing ready={startupComplete} />
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
  const { isPreviewOpen, previewUrl, closePreview } = useProject();
  const [showStartup, setShowStartup] = useState(true);
  const finishStartup = useCallback(() => setShowStartup(false), []);

  const location = useLocation();

  const isAdminRoute =
    location.pathname === '/admin';

  useEffect(() => {
    if (!isAdminRoute) {
      const leadSource = captureLeadVisit();
      if (leadSource) trackLeadSourceEvent(leadSource, 'visit');
      trackPageView(location.pathname).catch((error) => {
        console.error('Unable to record page view:', error);
      });
    }
  }, [isAdminRoute, location.pathname]);

  return (
    <>
      <AnimatePresence>
        {showStartup && <LoadingScreen key="startup" onComplete={finishStartup} />}
      </AnimatePresence>
      <div inert={showStartup} className="min-h-screen text-white flex flex-col">
        {!showStartup && <FireParticles zIndex={1} />}
        {!isAdminRoute && <Navbar />}
        <main className="flex-grow relative z-10">
          <Suspense fallback={showStartup ? null : <PageLoading />}>
            <AnimatedRoutes startupComplete={!showStartup} />
          </Suspense>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
      <WebPreviewModal isOpen={isPreviewOpen} url={previewUrl} onClose={closePreview} />

    </>
  );
}

function App() {
  return (
    <Router>

      {/* auto scroll top */}
      <ScrollToTop />

      <ProjectProvider>
        <ContentProvider>
          <MotionConfig reducedMotion="user"><AppContent /></MotionConfig>
        </ContentProvider>
      </ProjectProvider>

    </Router>
  );
}

export default App;
