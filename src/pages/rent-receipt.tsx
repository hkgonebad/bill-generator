import { Form, Button } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';

const RentReceipt = () => {
    return (
        <>
            <CustomNavbar />
            <section className="block">
            <div className="container">
                <h1>Rent Receipt Generator</h1>
                <Form className="mt-4">
                    <Form.Group controlId="tenantName">
                        <Form.Label>Tenant Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter tenant name" />
                    </Form.Group>
                    <Form.Group controlId="propertyAddress">
                        <Form.Label>Property Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter property address" />
                    </Form.Group>
                    <Form.Group controlId="rentAmount">
                        <Form.Label>Rent Amount (per month)</Form.Label>
                        <Form.Control type="number" placeholder="Enter rent amount" />
                    </Form.Group>
                    <Form.Group controlId="startDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" placeholder="Enter start date" />
                    </Form.Group>
                    <Form.Group controlId="endDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" placeholder="Enter end date" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Generate Receipt
                    </Button>
                </Form>
            </div>
            </section>
        </>
    );
};

export default RentReceipt;
