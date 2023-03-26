import CustomNavbar from '../components/Navbar';
import { Form, Button } from 'react-bootstrap';

const FuelBill = () => {
    return (
        <>
            <CustomNavbar />
            <section className="block">
            <div className="container">
                <h1>Fuel Bill Generator</h1>
                <Form className="mt-4">
                    <Form.Group controlId="vehicleNumber">
                        <Form.Label>Vehicle Number</Form.Label>
                        <Form.Control type="text" placeholder="Enter vehicle number" />
                    </Form.Group>
                    <Form.Group controlId="distanceTravelled">
                        <Form.Label>Distance Travelled (in km)</Form.Label>
                        <Form.Control type="number" placeholder="Enter distance travelled" />
                    </Form.Group>
                    <Form.Group controlId="fuelRate">
                        <Form.Label>Fuel Rate (per litre)</Form.Label>
                        <Form.Control type="number" placeholder="Enter fuel rate" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Generate Bill
                    </Button>
                </Form>
            </div>
            </section>
        </>
    );
};

export default FuelBill;