import { useState } from "react";
import Container from "../components/core/Container";
import Button from "../components/core/Button";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useSnackbar } from "notistack";

export default function GuestEntryPage({ onProfileSubmit }) {
  const { enqueueSnackbar } = useSnackbar();

  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  const placeholderImage = "https://via.placeholder.com/150"; // Replace with your placeholder URL

  const handleNameChange = (e) => {
    let name = e.target.value;
    if (name.length > 20) return;
    if (name && name === " ") return;
    setDisplayName(e.target.value);
  };

  const handleFormatName = (e) => {
    let name = e.target.value;
    setDisplayName(name.trim());
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!displayName || !profilePicture) {
      enqueueSnackbar("Please fill out both fields!", { variant: "error" });
      return;
    }

    // Call function to save data and transition to welcome page
    await onProfileSubmit({ displayName, profilePicture });
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold text-center mb-4">Join as a Guest</h1>

      <div className="flex flex-col items-center mb-4">
        {/* Profile Picture Section */}
        <div className="relative w-48 h-48">
          <img
            src={preview || placeholderImage}
            alt="Profile preview"
            className="w-48 h-48 rounded-full object-cover shadow-md"
          />
          <label
            htmlFor="profilePicture"
            className="absolute bottom-1 right-1 rounded-full cursor-pointer p-2 bg-gray-500 hover:bg-gray-600"
          >
            <CameraAltIcon className="text-white" />
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="displayName"
          className="block text-gray-700 font-semibold mb-2"
        >
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          value={displayName}
          onChange={handleNameChange}
          onBlur={handleFormatName}
          className="w-full border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Enter your name"
          required
        />
        <span className="mt-1 text-xs text-gray-500 block">
          Name should be less than 20 characters.
        </span>
      </div>

      <Button
        sx={{
          mt: 2,
        }}
        variant="contained"
        size="large"
        onClick={handleSubmit}
      >
        Continue
      </Button>
    </Container>
  );
}
