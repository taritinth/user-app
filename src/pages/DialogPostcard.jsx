import React, { useEffect, useState } from "react";
import { useImageExporter } from "../hooks/useImageExporter";
import Dialog from "../components/core/Dialog";
import {
  Box,
  CircularProgress,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
// import Copyright from "../components/icons/Copyright";
import HighFive from "../components/icons/HighFive";

const getRankingIconSize = (index) => {
  switch (index) {
    case 0:
      return "w-[84px]";
    case 1:
      return "w-12";
    case 2:
      return "w-10";
    default:
      return "w-10";
  }
};
const getRankingIcon = (index) => {
  switch (index) {
    case 0:
      return "rank/nads.png";
    case 1:
      return "rank/gold.png";
    case 2:
      return "rank/silver.png";
    default:
      return "rank/bronze.png";
  }
};

const DialogPostcard = ({ data, onClose }) => {
  //   const [images, setImages] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);
  const { exportedURL, exportRefCallback } = useImageExporter();

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      sx={{
        ...(typeof maxWidth === "number" && {
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
            },
          },
        }),
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Save Postcard
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <Close />
      </IconButton>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        dividers
      >
        <div className="h-0 w-0 overflow-hidden">
          <div
            ref={exportRefCallback}
            className="flex w-[611px] h-[989px] flex-col items-start overflow-hidden bg-white px-[70px] pb-[42px] pt-[72px]"
          >
            <div className="flex items-center w-full">
              <img
                src="monad.png"
                alt="Logo"
                className="w-[60px] h-[60px] mr-[12px]"
              />
              <h1
                className="text-[36px] font-secondary font-[600]"
                style={{
                  marginTop: "-36px",
                }}
              >
                Thainads Madnight
              </h1>
            </div>
            <div className="flex items-center w-full mt-[36px]">
              <div className="flex items-center mr-[60px]">
                <h1
                  className="text-[128px] font-secondary font-[600] mr-[12px]"
                  style={{
                    lineHeight: 1,
                  }}
                >
                  {data.total}
                </h1>
                <span
                  className="w-[52px] h-[52px]"
                  style={{
                    marginTop:
                      data.total.toString().length === 3
                        ? "37.5%"
                        : data.total.toString().length === 2
                        ? "47.5%"
                        : "80%",
                  }}
                >
                  <HighFive
                    style={{
                      marginTop: "-121.5%",
                    }}
                  />
                </span>
              </div>
              <div
                className="flex flex-col"
                style={{
                  marginTop: "40px",
                }}
              >
                <span
                  className="text-[30px] font-secondary font-[500] text-black text-opacity-60"
                  style={{
                    marginTop: "20px",
                  }}
                >
                  Rank
                </span>
                <h1
                  className="text-[64px] font-secondary font-[600]"
                  style={{
                    lineHeight: 1,
                    marginTop: "-10px",
                  }}
                >
                  {data.rank}
                </h1>
                {/* <div className="relative w-[100px] flex justify-center items-center mt-4">
                  <img
                    src={getRankingIcon(data.rank - 1)}
                    alt="bronze"
                    className={`z-[1] ${getRankingIconSize(data.rank - 1)}`}
                  />
                  <span
                    className={`absolute text-[24px] text-white font-bold z-[2]`}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform:
                        data.rank - 1 < 3
                          ? "translate(-50%, -60%)"
                          : "translate(-50%, -50%)",
                    }}
                  >
                    {data.rank}
                  </span>
                </div> */}
              </div>
            </div>
            <div
              className="flex flex-col items-start"
              style={{
                marginTop: "96px",
              }}
            >
              <span
                className="text-[30px] font-secondary font-[500] text-black text-opacity-60"
                style={{
                  marginTop: "-20px",
                }}
              >
                Name
              </span>
              <div className="flex mt-[8px]">
                <img
                  src={data.avatarUrl}
                  alt="Avatar"
                  className="w-[51px] h-[51px] rounded-full mr-[24px]"
                  style={{
                    marginTop: "20px",
                  }}
                  //   referrerPolicy="no-referrer"
                  //   crossOrigin="anonymous"
                />
                <h1
                  className="text-[48px] font-secondary font-[600] whitespace-nowrap overflow-hidden"
                  style={{
                    lineHeight: 1,
                    marginTop: "2px",
                    width: "471px",
                  }}
                >
                  {data.displayName}
                </h1>
              </div>
            </div>
            <div
              className="w-full border-t-2 border-white"
              style={{
                marginTop: "84px",
                marginBottom: "48px",
              }}
            ></div>
            <div className="flex flex-col items-start">
              <span
                className="text-[30px] font-secondary font-[500] text-black text-opacity-60"
                style={{
                  marginTop: "-20px",
                }}
              >
                You&apos;ve met these people IRL
              </span>
              <div
                className="flex flex-wrap w-full mt-[28px]"
                style={{
                  gap: "10px",
                }}
              >
                {data.connections.slice(0, 29).map((user, index) => (
                  <img
                    key={index}
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-[38px] h-[38px] rounded-full"
                    //   referrerPolicy="no-referrer"
                    //   crossOrigin="anonymous"
                  />
                ))}
                {data.connections.length > 29 && (
                  <span className="text-gray-500">
                    +{data.connections.length - 29}
                  </span>
                )}
              </div>
            </div>
            <div className="self-center mt-auto">
              <img
                src="copyright.png"
                className="w-[263px] h-[27px]"
                alt="Copyright"
              />
            </div>
          </div>
        </div>
        {!exportedURL ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <img
            src={exportedURL}
            alt="Postcard"
            className="w-full max-w-sm h-auto rounded-[24px] object-contain border border-gray-100 shadow-lg"
          />
        )}

        <div className="flex items-center mt-4">
          {!exportedURL ? (
            <p className="text-sm text-center">
              Generating your postcard. Please wait...
            </p>
          ) : (
            <p className="text-sm text-center">
              Long press on the above image and <b>Save Image</b> to your
              Gallery.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPostcard;
