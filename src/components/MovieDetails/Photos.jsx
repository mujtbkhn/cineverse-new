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
    // console.log(json);
    setImages(json.backdrops);
  };
  const handleForward = () => {
    setImages((prev) => prev.slice(5));
  };
  const handleBackward = () => {
    setImages((prev) => {
      const length = prev.length;
      if (length > 5) {
        return prev.slice(0, 5);
      } else {
        return [];
      }
    });
  };
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
  return (
    <div>
      <div className="flex justify-between px-8">
        <h2 className="text-3xl ">Photos: </h2>
        <div className="flex">
          <img
            src="https://img.icons8.com/pastel-glyph/64/circled-chevron-left.png"
            onClick={() => handleBackward()}
            alt=""
          />
          <img
            src="https://img.icons8.com/pastel-glyph/64/circled-chevron-right.png"
            onClick={() => handleForward()}
            alt=""
          />
        </div>
      </div>
      <div className="flex h-40 gap-2 overflow-x-scroll scrollbar-hide">
        {images.map((image, index) => (
          <img
            onClick={() => handleImage(index)}
            key={index}
            className="flex rounded-md"
            src={IMG_CDN_ORG + image?.file_path}
          />
        ))}
      </div>
      {isImageClicked && (
        <div className="flex flex-col items-center w-72 md:w-[800px] md:mx-auto">
          <div className="flex items-center justify-between w-full px-8">
            <img
              src="https://img.icons8.com/ios-filled/50/FFFFFF/chevron-left.png"
              onClick={handleImageBackward}
              className="w-12 h-12"
              alt=""
            />
            <img
              className="w-[800px] mx-auto"
              src={IMG_CDN_ORG + images[bigImageIndex]?.file_path}
              alt=""
            />
            <img
              src="https://img.icons8.com/ios-filled/50/FFFFFF/chevron-right.png"
              onClick={handleImageForward}
              alt=""
              className="w-12 h-12"
            />
          </div>
          <button onClick={() => setIsImageClicked(false)}>X</button>
        </div>
      )}
    </div>
  );
};

export default Photos;
