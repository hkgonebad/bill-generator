import Link from 'next/link';
import { Navbar, Nav } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
      <div className="container-fluid">
        <Navbar.Brand href="/">Bill Generator</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Link href="/" className='nav-link'>Home</Link>
            <Link href="/fuel-bill" className='nav-link'>Fuel Bill</Link>
            <Link href="/rent-receipt" className='nav-link'>Rent Receipt</Link>
            <Link href="/restaurant-bill" className='nav-link'>Restaurant Bill</Link>
            <Link href="/invoices" className='nav-link'>Invoices</Link>
            <Link href="/general-bill" className='nav-link'>General Bill</Link>
            <Link href="/medical-bill" className='nav-link'>Medical Bill</Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
