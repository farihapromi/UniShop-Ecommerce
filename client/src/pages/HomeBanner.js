import React from "react";
import "./HomeBanner.css";

const HomeBanner = () => {
  return (
    <div>
      <header className="header">
        <section className="section-header">
          <div className="header-content">
            <div className="col-6">
              <h1 className="heading">
                Let's make <span className="shop">Uni Shop</span> a part of your
                life
              </h1>
              <p className="heading-para">
                Welcome to <span className="heading-span">Uni Shop</span>, your
                online destination for the freshest groceries. Discover a wide
                range of quality products delivered straight to your doorstep.
              </p>
              <button className="shop-btn">Shop now</button>
            </div>
            <div className="col-6">
              <img
                className="myimg"
                src="images/banner1.png"
                alt="Beautiful Flowers"
              />
            </div>
          </div>
        </section>
      </header>
    </div>
  );
};

export default HomeBanner;
