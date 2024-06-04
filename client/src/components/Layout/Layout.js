import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

import { Toaster } from "react-hot-toast";

const Layout = ({ children, description, author, keywords, title }) => {
  return (
    <div>
      <Header />
      <Helmet>
        <meta charSet="utf-8" />

        <meta charset="UTF-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <main style={{ minHeight: "76vh" }}>
        <Toaster />
        {children}
      </main>
      <br></br>
      <Footer />
    </div>
  );
};
Layout.defaultProps = {
  title: "Ecommerce App",
  description: "Mern stack Project",
  keywords: "REACT,EXPRESS,MONGODB,NODE",
  author: "UniShop",
};

export default Layout;
