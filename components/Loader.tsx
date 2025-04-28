import ProcessLoader from "./ProcessLoader";

const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProcessLoader />
      </div>
    );
  };
  
  export default LoadingSpinner;
  