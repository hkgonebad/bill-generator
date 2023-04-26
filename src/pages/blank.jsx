import Head from 'next/head';
import CustomNavbar from '../components/Navbar';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { SetStateAction, useEffect, useState } from 'react';

const Blank = () => {

    return (
        <>
            <Head>
                <title>Title Here</title>
            </Head>
            
            <CustomNavbar />

            <section className="block">
                <Container>
                    
                </Container>
            </section>
        </>
    )
}
