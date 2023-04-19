import Head from 'next/head';
import CustomNavbar from '../components/Navbar';
import ChooseTemplate from '../components/ChooseTemplate';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { SetStateAction, useEffect, useState } from 'react';
import FuelTemplate1 from '../fuel/template1';

import moment, { Moment } from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import hpLogo from '../../src/assets/img/fuel/HP-grayscale.png'
import ioLogo from '../../src/assets/img/fuel/oil-grayscale.png'
import bpLogo from '../../src/assets/img/fuel/Bharat-grayscale.png'
import eoLogo from '../../src/assets/img/fuel/Essar-grayscale.png'

import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

const FuelBill = () => {

    // Set Logo
    const [selectedBrand, setSelectedBrand] = useState('bp');

    const handleBrandChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedBrand(event.target.value);
    }

    let selectedLogo;
    switch (selectedBrand) {
        case 'hp':
            selectedLogo = hpLogo;
            break;
        case 'io':
            selectedLogo = ioLogo;
            break;
        case 'bp':
            selectedLogo = bpLogo;
            break;
        case 'eo':
            selectedLogo = eoLogo;
            break;
        default:
            // default case
            selectedLogo = bpLogo;
            break;
    }

    // Form Fields
    const [fsName, setFsName] = useState("");
    const [fsAddress, setFsAddress] = useState("");
    const [fsRate, setFsRate] = useState<number>(0);
    const [fsTotal, setFsTotal] = useState<number>(0);
    const [fsVolume, setFsVolume] = useState<number>(0);

    useEffect(() => {
        const voldivide = fsTotal / fsRate;
        const volume = fsRate !== 0 ? parseFloat(voldivide.toFixed(2)) : 0;
        setFsVolume(volume);
    }, [fsRate, fsTotal]);

    const now = new Date();
    const formattedDate = moment(now).format('DD/MM/YYYY');
    const formattedTime = moment(now).format('hh:mm');
    const isValidDate = (current: moment.Moment) => {
        return current.isBefore(moment());
    };

    const [fsDate, setFsDate] = useState(formattedDate);
    const [fsTime, setFsTime] = useState(formattedTime);

    function restrictToNumbers(event: React.KeyboardEvent<HTMLInputElement>) {
        // Get the key code of the pressed key
        const keyCode = event.which || event.keyCode;
      
        // Allow only numbers and one decimal point
        if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
          event.preventDefault();
        } else if (keyCode === 46 && event.currentTarget.value.includes(".")) {
          event.preventDefault();
        }
    }

    const [csName, setCsName] = useState("Not Entered");
    const [vehNumber, setVehNumber] = useState("Not Entered");
    const [vehType, setVehType] = useState("Not Entered");
    const [paymentType, setPaymentType] = useState("");

    // Invoice/Reciept Number
    const invoiceDate = moment(now).format('DDMMYYYY');
    const invoiceTime = moment(now).format('hhmm');
    const randInvoiceGen = invoiceDate + invoiceTime;
    const [invoiceNumber, setInvoiceNumber] = useState(randInvoiceGen);

    // Set Tax Option
    const [selectedTaxOption, setTaxOption] = useState('none');
    const [taxNumber, setTaxNumber] = useState('');

    const handleTaxOption = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaxOption(event.target.value);
    }

    // Generate PDF
    const generatePDF = () => {
        const content = document.getElementById('previewArea');
        if (!content) {
            return;
        }
        // const pdfWidth = content.clientWidth;
        // const pdfHeight = content.clientHeight;
        // console.log(pdfWidth, pdfHeight)
        html2canvas(content).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'px');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const pdfDate = moment(now).format('DDMMYYYY');
            const pdfTime = moment(now).format('hhmm');
            pdf.save(`fuel-bill-${pdfDate}${pdfTime}.pdf`);
        });
    };

    const generateJPG = () => {
        const content = document.getElementById('previewArea');
        if (!content) {
          return;
        }
      
        html2canvas(content).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1);
            const link = document.createElement('a');
            const pdfDate = moment(now).format('DDMMYYYY');
            const pdfTime = moment(now).format('hhmm');
            link.download = `fuel-bill-${pdfDate}${pdfTime}.jpg`;
            link.href = imgData;
            link.click();
        });
    };
      

    return (
        <>
            <Head>
                <title>Fuel Bill Generator</title>
            </Head>
            
            <CustomNavbar />

            <section className="block">
                <Container>
                    <h1>Fuel Bill Generator</h1>

                    {/* <ChooseTemplate/> */}

                    <Row>
                        <Col md={6}>
                            <div className="fields">
                                <h5>Fuel Station Details</h5>
                                <Row>
                                    <Col md={12} className='mb-2'>
                                        {/* Select Logo */}
                                        
                                        <Form.Check
                                            inline
                                            label="Bharat Petroleum"
                                            name="fuelBrandSelect"
                                            type="radio"
                                            id="bp-logo"
                                            value="bp"
                                            checked={selectedBrand === 'bp'}
                                            onChange={handleBrandChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="HP Oil"
                                            name="fuelBrandSelect"
                                            type="radio"
                                            id="hp-logo"
                                            value="hp"
                                            checked={selectedBrand === 'hp'}
                                            onChange={handleBrandChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="Indian Oil"
                                            name="fuelBrandSelect"
                                            type="radio"
                                            id="io-logo"
                                            value="io"
                                            checked={selectedBrand === 'io'}
                                            onChange={handleBrandChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="Essar Oil"
                                            name="fuelBrandSelect"
                                            type="radio"
                                            id="eo-logo"
                                            value="eo"
                                            checked={selectedBrand === 'eo'}
                                            onChange={handleBrandChange}
                                        />
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group controlId='fsName' className='mb-2'>
                                            <Form.Label>Fuel Station Name</Form.Label>
                                            <Form.Control type="text" onChange={(e) => setFsName(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId='fsAddress' className='mb-2'>
                                            <Form.Label>Fuel Station Address</Form.Label>
                                            <Form.Control  as="textarea" rows={3} onChange={(e) => setFsAddress(e.target.value)} />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId='fsRate' className='mb-2'>
                                            <Form.Label>Fuel Rate</Form.Label>
                                            <Form.Control type="text" pattern="[0-9]*" onKeyPress={restrictToNumbers} onChange={(e) => setFsRate(parseFloat(e.target.value))} />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId='fsTotal' className='mb-2'>
                                            <Form.Label>Total Amount</Form.Label>
                                            <Form.Control type="text" pattern="[0-9]*" onKeyPress={restrictToNumbers} onChange={(e) => setFsTotal(parseFloat(e.target.value))} />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId='fsDate' className='mb-2'>
                                            <Form.Label>Fuel Bill Date</Form.Label>
                                            {/* <Form.Control type="text" onChange={(e) => setFsDate(e.target.value)} /> */}
                                            <Datetime
                                                inputProps={{ className: 'form-control', required: true }}
                                                dateFormat="DD/MM/YYYY"
                                                timeFormat={false}
                                                value={fsDate}
                                                onChange={(value) => setFsDate(moment(value).format("DD/MM/YYYY"))}
                                                isValidDate={isValidDate}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId='fsTime' className='mb-2'>
                                            <Form.Label>Fuel Bill Time</Form.Label>
                                            {/* <Form.Control type="text" onChange={(e) => setFsTime(e.target.value)} /> */}
                                            <Datetime
                                                inputProps={{ className: 'form-control', required: true }}
                                                dateFormat={false}
                                                timeFormat="HH:mm"
                                                value={fsTime}
                                                onChange={(value) => setFsTime(moment(value).format("HH:mm"))}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h5>Customer Details</h5>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group controlId='csName' className='mb-2'>
                                            <Form.Label>Customer Name</Form.Label>
                                            <Form.Control type="text" onChange={(e) => setCsName(e.target.value)} />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId='vehNumber' className='mb-2'>
                                            <Form.Label>Vehicle Number</Form.Label>
                                            <Form.Control type="text" onChange={(e) => setVehNumber(e.target.value)} />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId='vehType' className='mb-2'>
                                            <Form.Label>Select Vehicle Type</Form.Label>
                                            <Form.Select onChange={(e) => setVehType(e.target.value === "Select Vehicle Type" ? "" : e.target.value)}>
                                                <option>Select Vehicle Type</option>
                                                <option value="Petrol">Petrol</option>
                                                <option value="Diesel">Diesel</option>
                                                <option value="CNG">CNG</option>
                                                <option value="Electric">Electric</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId='paymentType' className='mb-2'>
                                            <Form.Label>Payment Method</Form.Label>
                                            <Form.Select onChange={(e) => setPaymentType(e.target.value === "Select one" ? "" : e.target.value)}>
                                                <option>Select one</option>
                                                <option value="Card">Card</option>
                                                <option value="Online">Online</option>
                                                <option value="Cash">Cash</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId='invoiceNumber' className='mb-2'>
                                            <Form.Label>Invoice Number</Form.Label>
                                            <Form.Control type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                                        </Form.Group>
                                    </Col>

                                    <Col md={12} className='mb-2'>
                                        {/* Select Tax */}
                                        <h5>Tax/GST Number</h5>
                                        <Form.Check
                                            inline
                                            label="None"
                                            name="taxNumberSelect"
                                            type="radio"
                                            id="notax"
                                            value="none"
                                            checked={selectedTaxOption === 'none'}
                                            onChange={handleTaxOption}
                                        />
                                        <Form.Check
                                            inline
                                            label="GST TIN"
                                            name="taxNumberSelect"
                                            type="radio"
                                            id="gsttin"
                                            value="GST No"
                                            checked={selectedTaxOption === 'GST No'}
                                            onChange={handleTaxOption}
                                        />
                                        <Form.Check
                                            inline
                                            label="CST TIN"
                                            name="taxNumberSelect"
                                            type="radio"
                                            id="csttin"
                                            value="CST No"
                                            checked={selectedTaxOption === 'CST No'}
                                            onChange={handleTaxOption}
                                        />
                                        <Form.Check
                                            inline
                                            label="TXN NO"
                                            name="taxNumberSelect"
                                            type="radio"
                                            id="txnno"
                                            value="TXN No"
                                            checked={selectedTaxOption === 'TXN No'}
                                            onChange={handleTaxOption}
                                        />
                                    </Col>

                                    {selectedTaxOption !== 'none' && (
                                    <Col md={12}>
                                        <Form.Group controlId='taxNumber'>
                                            <Form.Label>Enter {selectedTaxOption}</Form.Label>
                                            <Form.Control type="text" onChange={(e) => setTaxNumber(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    )}

                                    <div className="btns">
                                        {/* <Button variant="primary" onClick={generatePDF}>Generate PDF</Button> */}
                                        <Button variant="primary" onClick={generateJPG}>Generate</Button>
                                    </div>
                                </Row>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="previewArea" id='previewArea'>
                                <FuelTemplate1 
                                    logo={selectedLogo}
                                    fsName={fsName}
                                    fsAddress={fsAddress}
                                    fsRate={fsRate}
                                    fsTotal={fsTotal}
                                    fsVolume={fsVolume}
                                    fsDate={fsDate}
                                    fsTime={fsTime}
                                    csName={csName}
                                    vehNumber={vehNumber}
                                    vehType={vehType}
                                    paymentType={paymentType}
                                    invoiceNumber={invoiceNumber}
                                    selectedTaxOption={selectedTaxOption}
                                    taxNumber={taxNumber}
                                />
                            </div>
                        </Col>
                    </Row>

                </Container>
            </section>
        </>
    );
};

export default FuelBill;