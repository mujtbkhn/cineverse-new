import React from "react";

const Footer = () => {
  const handleNavigate = () => {
    window.open("https://github.com/mujtbkhn", "_blank");
  };

  return (
    <div className="text-white md:py-14 flex justify-center py-8 md:text-2xl bg-[#04152D]">
      Made with love and care by
      <button
        className="ml-2 text-yellow-500 cursor-pointer"
        onClick={handleNavigate}
      >
        Mujtaba Khan
      </button>
    </div>
  );
};

export default Footer;
