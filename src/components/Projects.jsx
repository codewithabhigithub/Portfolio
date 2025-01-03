import Divinerhythem from '../assets/Divinerhythem.png'
import Srigurudattaacademy from '../assets/Srigurudattaacademy.png'
import Aaronoutsourcing from '../assets/Aaronoutsourcing.png'
import CheckMyKundali from '../assets/CheckMyKundali.png'
import Sureshift from '../assets/Sureshift.png'
import Accredian from '../assets/Accredian.png'
import Cards from './Cards'


const Projects = () => {

    const projectJson = [
        {
          title: 'DeliverSocial',
          desc: 'Webelite Builders did an amazing job on our website. Their professionalism and dedication to our project were outstanding.',
          image: Divinerhythem,
          live: "https://deliversocial.in/",
          github: "#"
        },
        {
          title: 'Creatorsadda',
          desc: 'Webelite Builders did an amazing job on our website. Their professionalism and dedication to our project were outstanding.',
          image: Divinerhythem,
          live: "https://creatorsadda.com/",
          github: "#"
        },
        {
          title: 'Ukhproperties',
          desc: 'Webelite Builders did an amazing job on our website. Their professionalism and dedication to our project were outstanding.',
          image: Divinerhythem,
          live: "https://ukhproperties.com/",
          github: "#"
        },
        {
          title: 'Divinerhythem',
          desc: 'Webelite Builders did an amazing job on our website. Their professionalism and dedication to our project were outstanding.',
          image: Divinerhythem,
          live: "https://divinerhythem.com/",
          github: "#"
        },
        {
          title: 'Srigurudattaacademy',
          desc: 'The team at Webelite Builders exceeded our expectations with their digital marketing expertise. Highly recommend!',
          image: Srigurudattaacademy,
          live: "https://srigurudattaacademy.com",
          github: "https://github.com/rohitsingh93300/YtSpicyBites"
        },
        {
          title: 'Aaronoutsourcing',
          desc: 'Working with Webelite Builders was a seamless experience. They brought our vision to life with a modern, responsive website.',
          image: Aaronoutsourcing,
          live: "https://aaronoutsourcing.com",
          github: "#"
        },
        {
          title: 'CheckMyKundali',
          desc: 'Working with Webelite Builders was a seamless experience. They brought our vision to life with a modern, responsive website.',
          image: CheckMyKundali,
          live: "https://CheckMyKundali.com",
          github: "#"
        },
        {
          title: 'Sureshift',
          desc: 'Working with Webelite Builders was a seamless experience. They brought our vision to life with a modern, responsive website.',
          image: Sureshift,
          live: "https://www.sureshift.in/",
          github: "#"
        },
        {
          title: 'Accredian',
          desc: 'Working with Webelite Builders was a seamless experience. They brought our vision to life with a modern, responsive website.',
          image: Accredian,
          live: "https://accredian-frontend-task-livid-zeta.vercel.app/",
          github: "https://github.com/codewithabhigithub/Accredian-frontend-task.git"
        },
      ];

  return (
    <section id='projects' className='relative bg-gray-700 py-10 px-4'>
      <div className='mb-16 max-w-7xl mx-auto'>
        <h2 className='text-3xl font-bold mb-8 text-white border-b border-red-500 w-max pb-4'>My Projects</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-10'>
            {projectJson.map((items)=> {
                return <Cards item={items}/>
            })}
        </div>
      </div>
    </section>
  )
}

export default Projects
