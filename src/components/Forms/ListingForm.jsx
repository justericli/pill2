import React, { useState, useRef } from "react";
import Dropzone from "react-dropzone";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { BsCloudUpload } from "react-icons/bs";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

// Configure the AWS SDK
const s3 = new S3Client({
  region: "us-east-1", // Replace with your desired region
  credentials: {
    accessKeyId: "AKIA2AJRN6P67CIV6TTD",
    secretAccessKey: "ZA/r6XSUs2GdDq5Io3ryjJolRvp31WMvIMKj9pRp",
  },
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1", // Replace with your desired region
  accessKeyId: "AKIA2AJRN6P67CIV6TTD",
  secretAccessKey: "ZA/r6XSUs2GdDq5Io3ryjJolRvp31WMvIMKj9pRp",
});

// Add your Google Maps API key here
const GOOGLE_MAPS_API_KEY = "AIzaSyBYjnS4jS4wvokqFuovLwp8kOJ_Aa1Qi-c";

const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [bed, setBed] = useState("");
  const [bath, setBath] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(null); // Updated this to be an object

  const handleAddressSelect = (selected) => {
    setAddress(selected);
    geocodeByAddress(selected.label)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log("Latitude:", latLng.lat);
        console.log("Longitude:", latLng.lng);
      })
      .catch((error) => console.error("Error:", error));
  };

  // Create refs for the Dropzone and the Cloud icon
  const fileInputRef = useRef(null);

  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleFileDrop = (acceptedFiles) => {
    console.log(acceptedFiles);

    for (const file of acceptedFiles) {
      const fileExtension = file.name.split(".").pop();
      const acceptedExtensions = ["png"];

      if (acceptedExtensions.includes(fileExtension)) {
        setSelectedFiles((prevFiles) => [...prevFiles, file]);
      } else {
        alert("Invalid file type. Only PNG files are allowed.");
      }
    }
  };

  const handleUpload = async () => {
    for (const file of selectedFiles) {
      const uploadParams = {
        Bucket: "pilli-storage-f68b2ca801743-dev",
        Key: file.name,
        Body: file,
        ACL: "public-read",
      };

      try {
        const uploadData = await s3.send(new PutObjectCommand(uploadParams));
        console.log("Image uploaded successfully:", uploadData);

        const dynamoDBParams = {
          TableName: "rental_listings",
          Item: {
            id: uuidv4(),
            imageURL: `https://pilli-storage-f68b2ca801743-dev.s3.amazonaws.com/${file.name}`,
            "#bed": bed,
            "#bath": bath,
            description,
            address: address ? address.label : "",
          },
        };

        const dynamoDBData = await dynamoDB.put(dynamoDBParams).promise();
        console.log("Item added to DynamoDB:", dynamoDBData);
      } catch (err) {
        console.log("Error:", err);
      }
    }
  };

  const handleAddMorePictures = () => {
    // Trigger the file input click event
    fileInputRef.current && fileInputRef.current.open();
  };

  const handleCloudIconClick = () => {
    // Trigger the file input click event
    fileInputRef.current && fileInputRef.current.open();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <Dropzone
          onDrop={handleFileDrop}
          multiple={true}
          maxSize={20 * 4032 * 4032}
          noClick // Prevents the click event from triggering the file upload
          ref={fileInputRef} // Assign the ref to the Dropzone
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} id="file-input" />
              {selectedFiles.length > 0 ? (
                <div>
                  {selectedFiles.map((file, index) => (
                    <div key={index}>
                      <span>{file.name}</span>
                      <button onClick={() => handleRemoveFile(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h1>Create a new listing</h1>
                  <BsCloudUpload size={48} onClick={handleCloudIconClick} />
                  <div>Drag and drop images here or click to select</div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        {selectedFiles.length > 0 && (
          <button onClick={handleAddMorePictures}>Add More Pictures</button>
        )}
        <form>
          <label>
            # Bed:
            <input
              type="text"
              value={bed}
              onChange={(e) => setBed(e.target.value)}
            />
          </label>
          <label>
            # Bathroom:
            <input
              type="text"
              value={bath}
              onChange={(e) => setBath(e.target.value)}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Address:
            <PlacesAutocomplete
              value={address ? address.label : ""}
              onChange={setAddress}
              onSelect={handleAddressSelect}
              apiKey={GOOGLE_MAPS_API_KEY}
            />
          </label>
        </form>
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default ImageUpload;
