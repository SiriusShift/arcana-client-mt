import React from 'react';
import { useForm } from 'react-hook-form';
import Webcam from 'react-webcam';

const WebcamForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const webcamRef = React.useRef(null);

  const onCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Store the captured image in the form
    setValue('image', imageSrc);
  };

  const onSubmit = (data) => {
    console.log('Form Data:', data); // You can handle the data here (e.g., send to server)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Webcam Capture</h3>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400} // You can adjust the width as needed
        height={300} // You can adjust the height as needed
      />
      <div>
        <button type="button" onClick={onCapture}>Capture Photo</button>
      </div>
      <input type="hidden" {...register('image')} /> {/* Hidden input to store the image */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default WebcamForm;
