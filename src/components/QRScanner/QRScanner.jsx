import { useRef, useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import "./qrScanner.css";
import { CameraFrame } from "./CameraFrame";

import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const QRScanner = () => {
  const { enqueueSnackbar } = useSnackbar();
  // QR States
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Result
  const [scannedResult, setScannedResult] = useState("");
  const [showResult, setShowResult] = useState(false); // New state to control result display

  // Success
  const onScanSuccess = (result) => {
    if (scannedResult !== "") return;
    if (!result?.data) {
      console.log("QR Code is empty or not valid");
      enqueueSnackbar("QR Code is empty or not valid", { variant: "error" });
      return;
    }
    enqueueSnackbar(result?.data, { variant: "success" });

    console.log(result);
    setScannedResult(result?.data);
    setShowResult(true); // Show result in non-blocking way
  };

  // Fail
  const onScanFail = (err) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
        maxScansPerSecond: 1,
      });

      // Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => {
          setQrOn(true);
          setInitialized(true); // Set initialized to true when scanner starts successfully
        })
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      // Cleanup scanner on unmount
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader">
      {!initialized && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {/* QR Scanner */}

      {/* Show loading indicator when not initialized */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box"></div>
      <CameraFrame />
    </div>
  );
};

export default QRScanner;
