import React, { useState } from 'react';
import facebook from '../assets/facebook.png';
import instagram from '../assets/instagram.png';
import twitter from '../assets/twitter.png';
import linkedin from '../assets/linkedin.png';
import github2 from '../assets/github2.png';
import Lottie from 'lottie-react';
import contact from '../assets/Contact.json';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      to_name: 'Abhishek Gupta', // Replace with the recipient's name or dynamic value
      from_name: formData.user_name,
      from_no: formData.user_no,
      from_email: formData.user_email,
      message: formData.message,
    };

    // Send email using EmailJS
    emailjs
      .send('service_53ai9rr', 'template_r26y8dn', templateParams, 'x5OFTTtJagN5iQ3Uv')
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);
          setStatus('Message sent successfully!');
          setFormData({ user_name: '',user_no: '', user_email: '', message: '' }); // Clear the form
        },
        (error) => {
          console.error('Error sending email:', error.text);
          setStatus('Error sending message, please try again.');
        }
      );
  };

  return (
    <section id="contact" className="z-50 bg-gray-800 relative py-10 px-5 md:px-0">
      <div className="mb-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="md:w-1/2 mb-8 ml-2 md:mb-0">
            <h2 className="text-3xl font-bold mb-3 text-red-500">Get in Touch</h2>
            <p className="mb-4 text-white/85">
              I'm always open to new opportunities and collaboration. Feel free to reach out!
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/abhishekgupta782002" target='_blank' className="text-foreground/60 hover:text-foreground/80">
                <img src={facebook} alt="" className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/abhishekgupta782002/" target='_blank' className="text-foreground/60 hover:text-foreground/80">
                <img src={instagram} alt="" className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/abhishek-gupta-8a6204193/" target='_blank' className="text-foreground/60 hover:text-foreground/80">
                <img src={linkedin} alt="" className="h-6 w-6" />
              </a>
              <a href="https://x.com/Abhishe01860637" target='_blank' className="text-foreground/60 hover:text-foreground/80">
                <img src={twitter} alt="" className="h-6 w-6" />
              </a>
              <a href="https://github.com/codewithabhigithub" target='_blank' className="text-foreground/60 hover:text-foreground/80">
                <img src={github2} alt="" className="h-6 w-6" />
              </a>
            </div>
            <Lottie animationData={contact} className="w-[350px] mx-auto lg:w-[500px]" />
          </div>
          <form className="w-full md:w-1/2 bg-gray-100 rounded-lg border border-red-300 shadow-lg shadow-red-500 p-10" onSubmit={handleSubmit}>
            <h1 className="text-gray-900 text-4xl font-bold mb-7">Contact Me</h1>
            <div className="mb-4">
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                placeholder="Full Name"
                value={formData.user_name}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="user_no" className="block text-sm font-medium text-gray-700">Phone No.</label>
              <input
                type="text"
                id="user_no"
                name="user_no"
                placeholder="Enter Your Phone No."
                value={formData.user_no}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                placeholder="Email"
                value={formData.user_email}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter Your Message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button className="bg-red-500 text-white px-3 py-2 rounded-lg">Send Message</button>
            {status && <p className={`mt-4 ${status.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
