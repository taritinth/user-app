/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import "./qrScanner.css";
import { CameraFrame } from "./CameraFrame";

import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

import { useDialog } from "../../context/DialogContext";

const QRScanner = ({ validResultFormat, onScan, isLoading, isNotFound }) => {
  const { openDialog, closeDialog } = useDialog();

  // QR States
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const isScanError = useRef(false);

  // Result
  const scanCount = useRef(0);

  // Success
  const onScanSuccess = (result) => {
    if (scanCount.current > 0 || isNotFound || isLoading || isScanError.current)
      return;

    // Check if the scanned result is in the valid format
    if (validResultFormat && !result?.data?.startsWith(validResultFormat)) {
      console.log("QR Code is not in the valid format");
      isScanError.current = true;

      openDialog({
        type: "error",
        title: "Invalid QR Code",
        content: "The scanned QR Code is not in valid format.",
        onClose: () => {
          isScanError.current = false;
          closeDialog();
        },
      });

      return;
    }

    scanCount.current += 1;
    onScan && onScan(result?.data);
  };

  // After user acknowledges the error, reset the scan count
  useEffect(() => {
    if (!isNotFound) {
      scanCount.current = 0;
    }
  }, [isNotFound]);

  // Fail
  const onScanFail = (err) => {
    console.log("QR Scan failed:", err);
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
