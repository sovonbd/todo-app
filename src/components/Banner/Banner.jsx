import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative">
      <img
        src="https://i.imgur.com/p9sFcYL.jpg"
        className="w-full md:h-[300px] lg:h-[500px]"
        alt=""
      />
      <div className="absolute top-0 w-full h-full bg-gradient-to-t from-black to-black md:to-white/10 opacity-30"></div>

      <div className="absolute top-1/2 md:left-1/2 md:-translate-x-1/2 -translate-y-1/2 text-center z-10">
        <p className="text-white text-xl md:text-4xl font-bold  mx-auto">
          Create your list
        </p>
        <p className="text-white/80 text-xs md:text-base">
          Create your list with the following button and get started with your
          plan
        </p>
        <Link to="/dashboard">
          <button className="btn bg-[#F36527] md:px-8 md:text-lg text-white normal-case border-[#F36527] hover:bg-transparent hover:border-[#F36527] hover:border-2 mt-4">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
