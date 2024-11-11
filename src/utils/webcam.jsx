import { Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Webcam from "react-webcam";
import { base64ToBlob } from "./CustomFunctions";

const WebcamForm = ({ submitImage, reset }) => {
  const { register, handleSubmit, setValue } = useForm();
  const webcamRef = React.useRef(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" for front, "environment" for back
  const [capturedImage, setCapturedImage] = useState(null);
  console.log(facingMode);

  const onCapture = (data) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setValue("image", imageSrc); // Store the captured image in the form
    const imageBlob = base64ToBlob(imageSrc);
    const uniqueFilename = `image_${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}.jpg`;
    const file = new File([imageBlob], uniqueFilename, { type: "image/jpeg" });
    submitImage(file);
  };

  const onRetake = () => {
    setCapturedImage(null); // Reset captured image to show webcam again
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onCapture)}>
      <div className="cameraBox">
        {capturedImage ? (
          // Show captured image with a "Retake" option
          <>
            <img src={capturedImage} alt="Captured" />
          </>
        ) : (
          // Show webcam view with a "Capture" button
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={{ facingMode: facingMode }}
              screenshotFormat="image/jpeg"
            />
          </>
        )}

        {/* Hidden input to store the image data */}
        <input type="hidden" {...register("image")} />
        <div className="cameraBox__button">
          <Button
            type="button"
            size="small"
            variant="outlined"
            onClick={() =>
              setFacingMode(facingMode === "user" ? "environment" : "user")
            }
          >
            {facingMode === "user" ? "Back" : "Front"}
          </Button>
          {capturedImage ? (
            <Button
              type="button"
              size="small"
              variant="outlined"
              onClick={onRetake}
            >
              Retake
            </Button>
          ) : (
            <Button
              type="submit"
              size="small"
              variant="outlined"
            >
              Capture
            </Button>
          )}
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
