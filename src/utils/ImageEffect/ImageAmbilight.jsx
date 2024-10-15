// import { useEffect, useRef } from "react";
// import "./ImageAmbilight.css";

// const ImageAmbilight = ({ imageSrc }) => {
//   const imageRef = useRef(null);
//   const canvasRef = useRef(null);
//   let intervalId;

//   useEffect(() => {
//     const canvasElement = canvasRef.current;
//     const context = canvasElement.getContext("2d");

//     const imageElement = imageRef.current;

//     function repaintAmbilight() {
//       const { width, height } = imageElement;
//       context.drawImage(imageElement, 0, 0, width, height);
//       const imageData = context.getImageData(0, 0, width, height);
      
//       const data = imageData.data;
//       for (let i = 0; i < data.length; i += 4) {
//         const red = data[i];
//         const green = data[i + 1];
//         const blue = data[i + 2];
        
//         data[i] = Math.min(red + 50, 255); // Increase red
//         data[i + 2] = Math.min(blue + 50, 255); // Increase blue
//       }
      
//       context.putImageData(imageData, 0, 0);
//     }

//     function startAmbilightRepaint() {
//       intervalId = window.setInterval(repaintAmbilight, 1000 / 30);
//     }

//     function stopAmbilightRepaint() {
//       clearInterval(intervalId);
//     }

//     if (imageElement.complete) {
//       repaintAmbilight();
//     } else {
//       imageElement.onload = repaintAmbilight;
//     }

//     return () => {
//       stopAmbilightRepaint();
//     };
//   }, []);

//   useEffect(() => {
//     const image = new Image();
//     image.onload = () => {
//       if (imageRef.current) {
//         imageRef.current.src = imageSrc;
//       }
//     };
//     image.src = imageSrc;

//     return () => {
//       URL.revokeObjectURL(image.src);
//     };
//   }, [imageSrc]);

//   return (
//     <div className="videoWrapper">
//       <div className="ambilightWrapper">
//         <div className="aspectRatio">
//           <img id="image" ref={imageRef} src={imageSrc} alt="Ambilight" />
//         </div>
//         <canvas id="ambilight" ref={canvasRef} />
//       </div>
//     </div>
//   );
// };

// export default ImageAmbilight;
