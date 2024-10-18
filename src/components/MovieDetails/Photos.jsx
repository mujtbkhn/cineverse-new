import React, { useEffect, useState } from "react";
import { IMG_CDN_ORG, OPTIONS } from "../../utils/constants";
import { useParams } from "react-router-dom";

const Photos = () => {
  const { movieId } = useParams();

  const [images, setImages] = useState([]);
  const [bigImageIndex, setBigImageIndex] = useState(0);
  const [isImageClicked, setIsImageClicked] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/images`,
      OPTIONS
    );
    const json = await data.json();
    setImages(json.backdrops);
  };

  // For scrolling through images horizontally
  const handleForward = () => {
    setImages((prev) => prev.slice(5)); // move to next set of 5 images
  };

  const handleBackward = () => {
    setImages((prev) => prev.length > 5 ? prev.slice(0, 5) : prev); // move to the previous set of images
  };

  // For navigating images in the modal
  const handleImageForward = () => {
    if (bigImageIndex < images.length - 1) {
      setBigImageIndex((prev) => prev + 1);
    }
  };

  const handleImageBackward = () => {
    if (bigImageIndex > 0) {
      setBigImageIndex((prev) => prev - 1);
    }
  };

  const handleImage = (index) => {
    setBigImageIndex(index);
    setIsImageClicked(true);
  };

  const closeModal = () => {
    setIsImageClicked(false);
  };

  return (
    <div>
      <div className="flex justify-between px-8">
        <h2 className="text-3xl">Photos: </h2>
        <div className="flex">
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/material-rounded/48/FFFFFF/circled-chevron-left.png"
            alt="circled-chevron-left"
            className="cursor-pointer"
            onClick={handleBackward}
          />
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/material-rounded/48/FFFFFF/circled-chevron-right.png"
            alt="circled-chevron-right"
            className="cursor-pointer"
            onClick={handleForward}
          />
        </div>
      </div>

      <div className="flex h-40 gap-2 overflow-x-scroll scrollbar-hide">
        {images?.map((image, index) => (
          <img
            onClick={() => handleImage(index)}
            key={index}
            className="flex rounded-md cursor-pointer"
            src={IMG_CDN_ORG + image?.file_path}
          />
        ))}
      </div>

      {isImageClicked && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div
            className="relative flex items-center justify-between w-11/12 md:w-[800px]"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking on image or arrows
          >
            <img
              src="https://img.icons8.com/ios-filled/50/FFFFFF/chevron-left.png"
              onClick={handleImageBackward}
              className="w-12 h-12 cursor-pointer"
              alt="Previous"
            />
            <img
              className="mx-auto max-h-[80vh]"
              src={IMG_CDN_ORG + images[bigImageIndex]?.file_path}
              alt="Selected"
            />
            <img
              src="https://img.icons8.com/ios-filled/50/FFFFFF/chevron-right.png"
              onClick={handleImageForward}
              className="w-12 h-12 cursor-pointer"
              alt="Next"
            />
            {/* <button
              className="absolute text-3xl text-white top-2 right-2"
              onClick={closeModal}
            >
              &times;
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
