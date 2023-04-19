import CustomNavbar from '../components/Navbar';

const HomePage = () => {
  return (
    <>
      <CustomNavbar />
      <section className="block">
        <div className="container">
          <h1>Welcome to Bill Generator</h1>
          <p>Please select a bill generator from the navigation bar above.</p>
        </div>
      </section>
    </>
  );
};

export default HomePage;