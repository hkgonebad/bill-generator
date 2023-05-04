import { useState } from 'react';
import CustomNavbar from '../components/Navbar';
import { Modal, Button } from 'react-bootstrap';

const HomePage = () => {

  const [showModal, setShowModal] = useState<string | null>(null);

  const handleClose = () => setShowModal(null);
  const handleShow = (modal: string) => {
    setShowModal(modal);
  };

  return (
    <>
      <CustomNavbar />
      <section className="block home">
        <div className="container">
          <h1>Welcome to Bill Generator!</h1>
          <p>Our bill generator is a free tool that allows you to easily create digital copies of bills, receipts, and other documents for personal record keeping or as proof of purchase. Whether you need to generate a petrol bill, rent receipt, medical bill, or any other type of bill, our bill generator makes it quick and simple.</p>

          <p>To get started, simply select a bill generator from the navigation bar above. Each bill generator has a simple form that you can fill out with the relevant information. Once you`ve filled out the form, our bill generator will create a digital copy of the bill that you can download, save, or print.</p>

          <p>Our bill generator is designed for personal use or testing purposes only. Please read our <a href='#!' onClick={() => handleShow('disclaimer')}>disclaimer</a> and <a href='#!' onClick={() => handleShow('terms')}>terms of usage</a> carefully before using our tool. We do not encourage or condone any illegal or fraudulent activities, including the creation of fake bills or the use of our bill generator for such purposes.</p>

          <p>If you have any questions or feedback, please don`t hesitate to contact us. Thank you for using our bill generator!</p>
        </div>
      </section>

      <Modal show={showModal === 'disclaimer'} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Disclaimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Disclaimer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal === 'terms'} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Terms</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Terms.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HomePage;