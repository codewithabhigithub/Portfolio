import Navbar from './Navbar'
import Hero from './Hero'
import ParticleBackground from './Particle'
import About from './About'
import Projects from './Projects'
import Testimonials from './Testimonials'
import Contact from './Contact'
import Footer from './Footer'

const Home = () => {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <Hero />
      <About/>
      <Projects/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </>
  )
}

export default Home
