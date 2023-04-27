import Link from 'next/link';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
      <Container >
        <Navbar.Brand href="/">Bill Generator</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Link href="/" className='nav-link'>Home</Link>
            <Link href="/fuel-bill" className='nav-link'>Fuel Bill</Link>
            <Link href="/rent-receipt" className='nav-link'>Rent Receipt</Link>
            <NavDropdown title="Tools" id="basic-nav-dropdown" align="end">
              <Link href="/tools" className='dropdown-item'>All Tools</Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
