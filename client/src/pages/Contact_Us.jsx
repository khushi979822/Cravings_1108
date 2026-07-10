import React, { useState } from "react";
import contactImage from "../images/contactPage.jpg";


const Contact_Us = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      page: "contact",
      action: "contact_form",
    };

    console.log("Contact payload ready for backend:", payload);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
            Contact Us
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            We are here to help with every craving.
          </h1>

          <p className="text-lg text-gray-600">
            Reach out for support, partnership queries, or feedback. Our team
            will get back to you as soon as possible.
          </p>

          <div className="grid gap-4">
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-semibold text-gray-900">Email Support</h3>
              <p className="text-gray-600 mt-1">support@cravings.com</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-semibold text-gray-900">Call Us</h3>
              <p className="text-gray-600 mt-1">+91 9798227499</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-semibold text-gray-900">Visit</h3>
              <p className="text-gray-600 mt-1">Karond, Bhopal</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <img
            src={contactImage}
            alt="Contact support"
            className="h-52 w-full object-cover"
          />

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help"
              rows="3"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact_Us;
