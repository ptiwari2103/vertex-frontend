import React from "react";

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 text-primary">Welcome to My React App</h1>
          <p className="lead">
            This is a simple home page using Bootstrap in React.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
