import ReactStars from "react-rating-stars-component";
import React from "react";

const Rating = ({ onRatingChanged }) => {
  const ratingChanged = (newRating) => {
    console.log(newRating);
    onRatingChanged(newRating);
  };

  return (
    <div>
      <ReactStars
        count={5}
        onChange={ratingChanged}
        size={48}
        isHalf={true}
        emptyIcon={<i className="far fa-star"></i>}
        halfIcon={<i className="fa fa-star-half-alt"></i>}
        fullIcon={<i className="fa fa-star"></i>}
        activeColor="#ffd700"
      />
    </div>
  );
};

export default Rating;
