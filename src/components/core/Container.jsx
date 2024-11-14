const Container = ({ children }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6 max-w-sm mx-auto">
      {children}
    </div>
  );
};

export default Container;
