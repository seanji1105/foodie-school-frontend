import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12 py-8">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; 2025 Foodie School. All rights reserved.</p>
        <ul className="flex justify-center space-x-4 mt-4">
          <li><a href="/about" className="hover:text-blue-500">About</a></li>
          <li><a href="/contact" className="hover:text-blue-500">Contact</a></li>
          <li><a href="/privacy" className="hover:text-blue-500">Privacy Policy</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
