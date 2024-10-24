const rectWidth = 40;
const strokeWidth = 10;
const strokeColor = "white";

export const CameraFrame = () => {
  return (
    <div
      className="qr-frame"
      style={{
        width: 256,
        height: 256,
        position: "absolute",
      }}
    >
      <svg
        width={rectWidth}
        height={rectWidth}
        viewBox="-10 -10 120 120"
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        <path
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          d="M 0 0 L 61 0 C 80.5 0 100 19.5 100 39 L 100 100"
        ></path>
      </svg>
      <svg
        width={rectWidth}
        height={rectWidth}
        viewBox="-10 -10 120 120"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          transform: "rotate(90deg)",
        }}
      >
        <path
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          d="M 0 0 L 61 0 C 80.5 0 100 19.5 100 39 L 100 100"
        ></path>
      </svg>
      <svg
        width={rectWidth}
        height={rectWidth}
        viewBox="-10 -10 120 120"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          transform: "rotate(180deg)",
        }}
      >
        <path
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          d="M 0 0 L 61 0 C 80.5 0 100 19.5 100 39 L 100 100"
        ></path>
      </svg>
      <svg
        width={rectWidth}
        height={rectWidth}
        viewBox="-10 -10 120 120"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "rotate(-90deg)",
        }}
      >
        <path
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          d="M 0 0 L 61 0 C 80.5 0 100 19.5 100 39 L 100 100"
        ></path>
      </svg>
    </div>
  );
};
