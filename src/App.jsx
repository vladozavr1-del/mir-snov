import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigation } from './components/Navigation/Navigation'
import { ParticleField } from './components/ParticleField/ParticleField'
import { FogLayer } from './components/FogLayer/FogLayer'
import { FeatherCursor } from './components/FeatherCursor/FeatherCursor'
import { InkCanvas } from './components/InkCanvas/InkCanvas'
import { ScrollProgress } from './components/ScrollProgress/ScrollProgress'
import { Home } from './pages/Home/Home'
import { Dictionary } from './pages/Dictionary/Dictionary'
import { DictionarySymbol } from './pages/Dictionary/DictionarySymbol'
import { Articles } from './pages/Articles/Articles'
import { Article } from './pages/Articles/Article'
import { About } from './pages/About/About'

const pageVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollProgress />
      <ParticleField />
      <FogLayer />
      <InkCanvas />
      <FeatherCursor />
      <Navigation />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<PageWrapper><Home /></PageWrapper>}
          />
          <Route
            path="/dictionary"
            element={<PageWrapper><Dictionary /></PageWrapper>}
          />
          <Route
            path="/dictionary/:id"
            element={<PageWrapper><DictionarySymbol /></PageWrapper>}
          />
          <Route
            path="/articles"
            element={<PageWrapper><Articles /></PageWrapper>}
          />
          <Route
            path="/articles/:id"
            element={<PageWrapper><Article /></PageWrapper>}
          />
          <Route
            path="/about"
            element={<PageWrapper><About /></PageWrapper>}
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}
