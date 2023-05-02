import Head from 'next/head';
import CustomNavbar from '../components/Navbar';
import { Container, Row, Col, Form, InputGroup, Feedback } from 'react-bootstrap';
import { useEffect, useState, useMemo, useCallback } from 'react';

import moment, { Moment } from 'moment';

const WeeklyTimeCal = () => {

    const [totalReqDay, setTotalReqDay] = useState(9);

    const [totalReqWeek, setTotalReqWeek] = useState('');
    const [weekTimes, setWeekTimes] = useState([
        { day: 'Monday', inTime: '', outTime: '' },
        { day: 'Tuesday', inTime: '', outTime: '' },
        { day: 'Wednesday', inTime: '', outTime: '' },
        { day: 'Thursday', inTime: '', outTime: '' },
        { day: 'Friday', inTime: '', outTime: '' },
        { day: 'Saturday', inTime: '', outTime: '' },
        { day: 'Sunday', inTime: '', outTime: '' },
    ]);

const [isValid, setIsValid] = useState(Array(7).fill(true));

const handleInTimeChange = (index, value) => {
  setWeekTimes((prevWeekTimes) => {
    const newWeekTimes = [...prevWeekTimes];
    const inTime = moment(value, "HH:mm");
    const outTime = moment(newWeekTimes[index].outTime, "HH:mm");
    const isValidTime = inTime.isValid();
    newWeekTimes[index].inTime = value;
    newWeekTimes[index].totalTime = outTime.isValid()
      ? outTime.diff(inTime, "minutes") / 60
      : 0;
    setIsValid((prev) => [      ...prev.slice(0, index),      isValidTime,      ...prev.slice(index + 1),    ]);
    const extraTime = (newWeekTimes[index].totalTime - totalReqDay).toFixed(2);
    const extraHours = Math.floor(extraTime);
    const extraMinutes = moment.duration(Math.round((extraTime % 1) * 60), "minutes").asMinutes();
    newWeekTimes[index].extraTime = extraTime > 0 ? `${extraHours}h ${extraMinutes}m` : "0h 0m";
    return newWeekTimes;
  });
};

const handleOutTimeChange = (index, value) => {
  setWeekTimes((prevWeekTimes) => {
    const newWeekTimes = [...prevWeekTimes];
    const inTime = moment(newWeekTimes[index].inTime, "HH:mm");
    const outTime = moment(value, "HH:mm");
    const isValidTime = outTime.isValid();
    newWeekTimes[index].outTime = value;
    newWeekTimes[index].totalTime = inTime.isValid()
      ? outTime.diff(inTime, "minutes") / 60
      : 0;
    setIsValid((prev) => [      ...prev.slice(0, index),      isValidTime,      ...prev.slice(index + 1),    ]);
    const extraTime = (newWeekTimes[index].totalTime - totalReqDay).toFixed(2);
    const extraHours = Math.floor(extraTime);
    const extraMinutes = moment.duration(Math.round((extraTime % 1) * 60), "minutes").asMinutes();
    newWeekTimes[index].extraTime = extraTime > 0 ? `${extraHours}h ${extraMinutes}m` : "0h 0m";
    return newWeekTimes;
  });
};

    const calculateTotalTime = () => {
        let totalTime = 0;
        weekTimes.forEach((day) => {
          if (day.inTime && day.outTime) {
            const inTime = moment(day.inTime, 'HH:mm');
            const outTime = moment(day.outTime, 'HH:mm');
            totalTime += outTime.diff(inTime, 'minutes') / 60; // Divide by 60 to convert minutes to hours
          }
        });
        return totalTime;
    };

    const totalCoveredTime = calculateTotalTime();
    const remainingTime = parseInt(totalReqWeek) - totalCoveredTime;

    const updateWeekTimes = useCallback((updatedWeekTimes) => {
      setWeekTimes(updatedWeekTimes);
    }, []);
    
    useEffect(() => {
      const updatedWeekTimes = weekTimes.map((day) => {
        if (day.inTime && day.outTime) {
          const completedHours = moment.duration(moment.utc(day.outTime, 'HH:mm').diff(moment.utc(day.inTime, 'HH:mm'))).asHours();
      
          if (completedHours < totalReqDay) {
            day.bgClass = 'bg-danger text-light';
          } else {
            day.bgClass = 'bg-success text-light';
          }
        }
        return day;
      });
      
      updateWeekTimes(updatedWeekTimes);
    }, [weekTimes, totalReqDay, updateWeekTimes]);

    return (
        <>
            <Head>
                <title>Weekly Time Caluculator - Tools</title>
            </Head>
            
            <CustomNavbar />

            <section className="block">
                <Container>
                    <h1 className='pageTitle'>Weekly Time Caluculator</h1>

                    <div className="timeCal">
                        <h5>Enter your In/Out times below</h5>

                        <Row>
                          <Col>
                            <Form.Group className="mb-3" controlId="totalReqDay">
                              <Form.Label>Total required time per day</Form.Label>
                              <Form.Control type="text" placeholder="For eg: 9" value={totalReqDay} onChange={(e) => setTotalReqDay(e.target.value)} />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3" controlId="totalReqWeek">
                              <Form.Label>Total required time per week</Form.Label>
                              <Form.Control type="text" placeholder="For eg: 45" value={totalReqWeek} onChange={(e) => setTotalReqWeek(e.target.value)} />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Label>Enter In/Out times for the week</Form.Label>
                        {weekTimes.map((day, index) => (
                            <InputGroup className="mb-3" key={day.day}>
                                <InputGroup.Text className='theDay'>{day.day}</InputGroup.Text>
                                <Form.Control className='theTime' placeholder="In Time" value={day.inTime} onChange={(e) => handleInTimeChange(index, e.target.value)} isInvalid={!isValid[index]} />
                                <Form.Control className='theTime' placeholder="Out Time" value={day.outTime} onChange={(e) => handleOutTimeChange(index, e.target.value)} isInvalid={!isValid[index]} />
                                <InputGroup.Text className={`isCompleted ${day.bgClass}`}>
                                    Completed {(day.inTime && day.outTime) ? moment.duration(moment.utc(day.outTime, 'HH:mm').diff(moment.utc(day.inTime, 'HH:mm'))).asHours().toFixed(2) : '0'} hrs
                                </InputGroup.Text>
                                <InputGroup.Text className={day.bgClass}>
                                    Extra time: {day.extraTime}
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                    Entered time is not valid, please use the format of 00:00 i.e. hh:mm.
                                </Form.Control.Feedback>
                            </InputGroup>
                        ))}

                        <p>Total covered time: {totalCoveredTime.toFixed(2)} hours</p>
                        <p>Remaining time: {(remainingTime >= 0 ? remainingTime : 0).toFixed(2)} hours</p>

                    </div>
                </Container>
            </section>
        </>
    )
}

export default WeeklyTimeCal;