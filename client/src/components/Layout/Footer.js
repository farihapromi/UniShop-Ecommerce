import React from "react";
import { Link } from "react-router-dom";
import "../Layout/Footer.css";

// Import payment method logos
import visaLogo from "../../assets/payment-logos/visa.jpg";
import mastercardLogo from "../../assets/payment-logos/mastercard.png";
import paypalLogo from "../../assets/payment-logos/paypal.png";
import amexLogo from "../../assets/payment-logos/bkash.png";
// Import other logos as needed

const Footer = () => {
  return (
    <div className="pg-footer">
      <footer className="footer">
        <svg
          className="footer-wave-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path
            className="footer-wave-path"
            d="M851.8,100c125,0,288.3-45,348.2-64V0H0v44c3.7-1,7.3-1.9,11-2.9C80.7,22,151.7,10.8,223.5,6.3C276.7,2.9,330,4,383,9.8 c52.2,5.7,103.3,16.2,153.4,32.8C623.9,71.3,726.8,100,851.8,100z"
          ></path>
        </svg>
        <div className="footer-content">
          {/* Existing content here */}
          <div className="footer-content-column">
            <div className="footer-logo"></div>
            <div className="footer-menu">
              <h3 className="footer-menu-name">About Uni Shop</h3>
              <ul id="menu-get-started" className="footer-menu-list">
                <li className="menu-item menu-item-type-post_type menu-item-object-product">
                  <Link to="/team">Team</Link>
                </li>
                <li className="menu-item menu-item-type-post_type menu-item-object-product">
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li className="menu-item menu-item-type-post_type menu-item-object-product">
                  <Link to="/terms-of-use">Terms of use</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-content-column">
            <div className="footer-menu">
              <h3 className="footer-menu-name">Customer Service</h3>
              <ul id="menu-company" className="footer-menu-list">
                <li className="menu-item menu-item-type-post_type menu-item-object-page">
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li className="menu-item menu-item-type-taxonomy menu-item-object-category">
                  <Link to="/news">FAQ</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-content-column">
            <div className="footer-call-to-action">
              <h3 className="footer-call-to-action-title">Let's Chat</h3>
              <p className="footer-call-to-action-description">
                Have a support question?
              </p>
              <Link
                className="footer-call-to-action-button button"
                to="/get-in-touch"
                target="_self"
              >
                Get in Touch
              </Link>
            </div>
            <div className="footer-call-to-action">
              <h3 className="footer-call-to-action-title">You Call Us</h3>
              <p className="footer-call-to-action-link-wrapper">
                <a
                  className="footer-call-to-action-link"
                  href="tel:0124-64XXXX"
                  target="_self"
                >
                  01898-124560
                </a>
              </p>
            </div>
          </div>
          <div className="footer-content-column">
            <h3 className="footer-menu-name">Payment Methods</h3>
            <ul className="payment-methods-list">
              <li>
                <img src={visaLogo} alt="Visa" />
              </li>
              <li>
                <img src={mastercardLogo} alt="MasterCard" />
              </li>
              <li>
                <img src={paypalLogo} alt="PayPal" />
              </li>
              <li>
                <img src={amexLogo} alt="American Express" />
              </li>
              {/* Add more payment methods as needed */}
            </ul>
          </div>
        </div>
        <div>
          <h5 className="text-center">@2024 Uni Shop Limited</h5>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
