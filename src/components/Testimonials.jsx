import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';



// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {

    const testimonials = [
        {
            id: 1,
            name: "Diya Sharma",
            head: "Divinerhythem",
            rating: 5,
            text: "Excellent work! The site is fast, responsive, and visually appealing. Highly recommended!"
        },
        {
            id: 2,
            name: "Ankush Gupta",
            head: "Srigurudattaacademy",
            rating: 4,
            text: "Very satisfied with the outcome. The attention to detail and design are commendable!"
        },
        {
            id: 3,
            name: "Aaron",
            head: "Aaronoutsourcing",
            rating: 5,
            text: "Great experience working with the team! The website exceeded all my expectations completely."
        },
        {
            id: 4,
            name: "Dimpi Chauhan",
            head: "CheckMyKundali",
            rating: 5,
            text: "The website looks stunning and works flawlessly. Thank you for the amazing effort and dedication!"
        },
        {
            id: 5,
            name: "Chandan",
            head: "Sureshift",
            rating: 4,
            text: "The website is beautifully designed and highly user-friendly. It perfectly suits my needs and is highly professional!"
        },
        {
            id: 6,
            name: "Abhishek",
            head: "Accredian",
            rating: 5,
            text: "The website is exceptionally well-designed and completely user-friendly. Highly satisfied with it!"
        },
        {
            id: 7,
            name: "Aditi Verma",
            head: "Head of the Company",
            rating: 5,
            text: "Impeccable work! The site’s design and performance are absolutely fantastic and user-friendly."
        },
        {
            id: 7,
            name: "Manoj Kumar",
            head: "Client",
            rating: 5,
            text: "Impeccable work! The site’s design and performance are absolutely fantastic and user-friendly."
        }
    ]

    return (
        <div id='testimonials' className='py-10 bg-gray-100 relative' >
            <h1 className='text-center text-2xl lg:text-4xl font-bold'>What our Customer Say</h1>
            <div className='max-w-6xl mx-auto py-10 px-5'>
                <Swiper
                    style={{
                        "--swiper-pagination-color": "#EF4444",
                        "--swiper-pagination-bullet-inactive-color": "#999999",
                        "--swiper-pagination-bullet-inactive-opacity": "1",
                        "--swiper-pagination-bullet-size": "10px",
                        "--swiper-pagination-bullet-horizontal-gap": "6px",
                    }}
                    modules={[Pagination, Autoplay]}
                    loop={true}
                    speed={600}
                    autoplay={{ delay: 5000 }}
                    slidesPerView={3}
                    spaceBetween={30}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        480: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    pagination={{
                        el: ".swiper-pagination",
                        type: "bullets",
                        clickable: true,
                    }}
                    className="mySwiper"
                >
                    {testimonials.map((item) => {
                        return <SwiperSlide key={item.id}>
                            <div className='border border-gray-400 shadow-md shadow-red-500 rounded-lg flex flex-col p-4'>
                                {item.rating === 4 ? (
                                    <div className='flex'>
                                        <Star fill='true' />
                                        <Star fill='true' />
                                        <Star fill='true' />
                                        <Star fill='true' />
                                        <Star />
                                    </div>
                                ) : (
                                    <div className='flex'>
                                        <Star fill='true' />
                                        <Star fill='true' />
                                        <Star fill='true' />
                                        <Star fill='true' />
                                        <Star fill='true' />
                                    </div>
                                )}
                                <p className='py-3'>{item.text}</p>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <h3 className='font-semibold text-red-500 text-lg'>{item.name}</h3>
                                        <p className='text-sm mt-1'>{item.head}</p>
                                    </div>
                                    <Quote className='text-red-400'/>
                                </div>
                            </div>
                        </SwiperSlide>
                    })}
                    <div className='swiper-pagination my-10 gap-1 relative'></div>

                </Swiper>
            </div>
        </div>
    )
}

export default Testimonials
