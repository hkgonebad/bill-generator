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

      <Modal show={showModal === 'disclaimer'} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Disclaimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This bill generator is intended for personal use or testing purposes only. We do not encourage or condone any illegal or fraudulent activities, including the creation of fake bills or the use of our bill generator for such purposes. The generated bills should only be used as a digital copy for personal record keeping or as proof of purchase. We are not responsible for any misuse of the bill generator or the generated bills. By using this bill generator, you agree to use it responsibly and in compliance with all applicable laws and regulations.</p>
        </Modal.Body>
      </Modal>

      <Modal show={showModal === 'terms'} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms of Use</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Welcome to our bill generator! By accessing or using our bill generator, you agree to be bound by the following terms and conditions:</p>
          <ul>
            <li>The bill generator is provided for personal use or testing purposes only. You are not allowed to use the bill generator for any illegal or fraudulent activities, including the creation of fake bills.</li>
            <li>You are solely responsible for the use of the bill generator and the generated bills. We are not responsible for any damages, losses, or liabilities arising from your use of the bill generator or the generated bills.</li>
            <li>You are not allowed to modify, distribute, reproduce, or sell the bill generator or the generated bills without our prior written consent.</li>
            <li>We reserve the right to modify, suspend, or terminate the bill generator at any time without prior notice.</li>
            <li>We reserve the right to modify these terms and conditions at any time without prior notice. Your continued use of the bill generator after such modifications will constitute your acceptance of the new terms and conditions.</li>
            <li>These terms and conditions are governed by and construed in accordance with the laws of Maharashtra. Any disputes arising from or related to the bill generator or these terms and conditions shall be subject to the exclusive jurisdiction of the courts of Maharashtra.</li>
          </ul>
          <p>By using our bill generator, you acknowledge that you have read, understood, and agreed to these terms and conditions. If you do not agree to these terms and conditions, you should not use the bill generator.</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HomePage;