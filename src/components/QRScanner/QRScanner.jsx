import { useRef, useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import "./qrScanner.css";
import { CameraFrame } from "./CameraFrame";

import { useSnackbar } from "notistack";

const QRScanner = () => {
  const { enqueueSnackbar } = useSnackbar();
  // QR States
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);

  // Result
  const [scannedResult, setScannedResult] = useState("");
  const [showResult, setShowResult] = useState(false); // New state to control result display

  // Success
  const onScanSuccess = (result) => {
    if (!result?.data) {
      console.log("QR Code is empty or not valid");
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
        maxScansPerSecond: 5,
      });

      // Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
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
      {/* QR Scanner */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <CameraFrame />
      </div>

      {/* Non-blocking result display */}
      {showResult && (
        <div className="result-display">
          <p>Scanned Result: {scannedResult}</p>
          <button onClick={() => setShowResult(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
