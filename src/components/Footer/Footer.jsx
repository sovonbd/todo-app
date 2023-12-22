import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="mt-20">
      <footer className="footer footer-center gap-3 p-10 bg-[#F36527] text-primary-content">
        <aside>
          <Link to="/" className="text-xl font-bold text-white">
            TODO
          </Link>
          <p className="font-bold text-white">
            TODO Technologies Inc. <br />
            Providing the services since 2000
          </p>
          <p className="text-white">Copyright © 2023 - All right reserved</p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-4 text-2xl text-white">
            <a href="https://www.facebook.com/">
              <FaFacebookF className="hover:scale-125 hover:duration-300"></FaFacebookF>
            </a>
            <a href="https://www.youtube.com/">
              <FaYoutube className="hover:scale-125 hover:duration-300"></FaYoutube>
            </a>
            <a href="https://twitter.com/?lang=en">
              <FaTwitter className="hover:scale-125 hover:duration-300"></FaTwitter>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
