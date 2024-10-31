import { Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Webcam from "react-webcam";
import { base64ToBlob } from "./CustomFunctions";

const WebcamForm = ({ submitImage }) => {
  const { register, handleSubmit, setValue } = useForm();
  const webcamRef = React.useRef(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" for front, "environment" for back
  const [capturedImage, setCapturedImage] = useState(null);
  console.log(facingMode);

  const onCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setValue("image", imageSrc); // Store the captured image in the form
  };

  const onRetake = () => {
    setCapturedImage(null); // Reset captured image to show webcam again
  };

  const onSubmit = (data) => {
    const imageBlob = base64ToBlob(data.image);
    const uniqueFilename = `image_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}.jpg`;
    const file = new File([imageBlob], uniqueFilename, { type: "image/jpeg" });
    submitImage(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="cameraModal">
        <Typography fontSize="1.5rem" fontWeight="600">
          Capture Image
        </Typography>
        <div className="cameraModal__image">
          {capturedImage ? (
            // Show captured image with a "Retake" option
            <>
              <img
                src={capturedImage}
                alt="Captured"
                width={400}
                height={300}
              />
            </>
          ) : (
            // Show webcam view with a "Capture" button
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={{ facingMode: facingMode }}
                screenshotFormat="image/jpeg"
                width={500} // Adjust width as needed
                height={300} // Adjust height as needed
              />
            </>
          )}
        </div>

        {/* Hidden input to store the image data */}
        <input type="hidden" {...register("image")} />
        <div className="cameraModal__button">
          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              setFacingMode(facingMode === "user" ? "environment" : "user")
            }
          >
            {facingMode === "user" ? "Back" : "Front"} Camera
          </Button>
          {capturedImage ? (
            <Button type="button" variant="outlined" onClick={onRetake}>
              Retake Photo
            </Button>
          ) : (
            <Button type="button" variant="outlined" onClick={onCapture}>
              Capture Photo
            </Button>
          )}
          <Button disabled={!capturedImage} type="submit" variant="contained">
            Submit
          </Button>
        </div>
      </div>
    </form>
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <h3>Webcam Capture</h3>
    //   <Webcam
    //     audio={false}
    //     ref={webcamRef}
    //     screenshotFormat="image/jpeg"
    //     width={400} // You can adjust the width as needed
    //     height={300} // You can adjust the height as needed
    //   />
    //   <div>
    //     <button type="button" onClick={onCapture}>Capture Photo</button>
    //   </div>
    //   <input type="hidden" {...register('image')} /> {/* Hidden input to store the image */}
    //   <button type="submit">Submit</button>
    // </form>
  );
};

export default WebcamForm;
