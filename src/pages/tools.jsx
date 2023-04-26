import Head from 'next/head';
import Link from 'next/link';
import CustomNavbar from '../components/Navbar';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { SetStateAction, useEffect, useState } from 'react';

const Tools = () => {

    return (
        <>
            <Head>
                <title>Tools</title>
            </Head>
            
            <CustomNavbar />

            <section className="block">
                <Container>
                    <h1 className='pageTitle'>Tools</h1>

                    <div className="iconsBoxes">
                        <Row>
                            <Col lg={3}>
                                <Link href="tools/weekly-time-calculator" className="iconBox card">
                                    <div className="card-body">
                                        Weekly Time Calculator
                                    </div>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
        </>
    )
}

export default Tools;