const Container = ({ children }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6">
      {children}
    </div>
  );
};

export default Container;
