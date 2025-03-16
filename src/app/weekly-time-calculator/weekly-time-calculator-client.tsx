"use client";

import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Form, InputGroup, Card, Table, Alert } from "react-bootstrap";
import Header from "@/components/Header";
import moment from "moment";
import { Clock } from "lucide-react";

interface DayTimeData {
  day: string;
  inTime: string;
  outTime: string;
  totalTime?: number;
  bgClass?: string;
  extraTime?: string;
}

export default function WeeklyTimeCalculatorClient() {
  const [totalReqDay, setTotalReqDay] = useState<number>(9);
  const [totalWeekTime, setTotalWeekTime] = useState<number>(0);
  const [totalReqWeek, setTotalReqWeek] = useState<number>(45);
  const [weeklyTarget, setWeeklyTarget] = useState<boolean>(false);
  const [weekTimes, setWeekTimes] = useState<DayTimeData[]>([
    { day: "Monday", inTime: "", outTime: "" },
    { day: "Tuesday", inTime: "", outTime: "" },
    { day: "Wednesday", inTime: "", outTime: "" },
    { day: "Thursday", inTime: "", outTime: "" },
    { day: "Friday", inTime: "", outTime: "" },
    { day: "Saturday", inTime: "", outTime: "" },
    { day: "Sunday", inTime: "", outTime: "" },
  ]);

  const [isValid, setIsValid] = useState<boolean[]>(Array(7).fill(true));

  const handleInTimeChange = (index: number, value: string) => {
    setWeekTimes((prevWeekTimes) => {
      const newWeekTimes = [...prevWeekTimes];
      const day = { ...newWeekTimes[index] };
      const inTime = moment(value, "HH:mm");
      const outTime = moment(day.outTime, "HH:mm");
      const isValidTime = inTime.isValid();
      day.inTime = value;
      day.totalTime = outTime.isValid() ? outTime.diff(inTime, "minutes") / 60 : 0;

      setIsValid((prev) => [...prev.slice(0, index), isValidTime, ...prev.slice(index + 1)]);

      // Calculate the bgClass based on completed time
      const completedTime = parseFloat(day.totalTime.toFixed(2)); // Parse as float
      const reqTime = parseFloat(totalReqDay.toString()); // Parse totalReqDay as float
      day.bgClass = completedTime >= reqTime ? "bg-success text-light" : "bg-danger text-light";

      // Calculate extra time
      const extraTime = (day.totalTime - totalReqDay).toFixed(2);
      const extraHours = Math.floor(Number(extraTime));
      const extraMinutes = moment.duration(Math.round((Number(extraTime) % 1) * 60), "minutes").asMinutes();
      day.extraTime = Number(extraTime) > 0 ? `${extraHours}h ${extraMinutes}m` : "0h 0m";

      newWeekTimes[index] = day;
      return newWeekTimes;
    });
  };

  const handleOutTimeChange = (index: number, value: string) => {
    setWeekTimes((prevWeekTimes) => {
      const newWeekTimes = [...prevWeekTimes];
      const day = { ...newWeekTimes[index] };
      const inTime = moment(day.inTime, "HH:mm");
      const outTime = moment(value, "HH:mm");
      const isValidTime = outTime.isValid();
      day.outTime = value;
      day.totalTime = inTime.isValid() ? outTime.diff(inTime, "minutes") / 60 : 0;

      setIsValid((prev) => [...prev.slice(0, index), isValidTime, ...prev.slice(index + 1)]);

      // Calculate the bgClass based on completed time
      const completedTime = parseFloat(day.totalTime.toFixed(2)); // Parse as float
      const reqTime = parseFloat(totalReqDay.toString()); // Parse totalReqDay as float
      day.bgClass = completedTime >= reqTime ? "bg-success text-light" : "bg-danger text-light";

      // Calculate extra time
      const extraTime = (day.totalTime - totalReqDay).toFixed(2);
      const extraHours = Math.floor(Number(extraTime));
      const extraMinutes = moment.duration(Math.round((Number(extraTime) % 1) * 60), "minutes").asMinutes();
      day.extraTime = Number(extraTime) > 0 ? `${extraHours}h ${extraMinutes}m` : "0h 0m";

      newWeekTimes[index] = day;
      return newWeekTimes;
    });
  };

  const calculateTotalTime = useCallback(() => {
    let totalTime = 0;
    weekTimes.forEach((day) => {
      if (day.inTime && day.outTime) {
        const inTime = moment(day.inTime, "HH:mm");
        const outTime = moment(day.outTime, "HH:mm");
        if (inTime.isValid() && outTime.isValid()) {
          totalTime += outTime.diff(inTime, "minutes") / 60; // Divide by 60 to convert minutes to hours
        }
      }
    });
    return totalTime;
  }, [weekTimes]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const totalTime = calculateTotalTime();
    setTotalWeekTime(totalTime);
    setWeeklyTarget(totalTime >= totalReqWeek);
  }, [weekTimes, calculateTotalTime, totalReqWeek]);

  return (
    <>
      <Header title="Weekly Time Calculator" subtitle="Track and calculate your weekly working hours" icon={<Clock size={24} />} buttonText="View All Tools" buttonLink="/tools" />
      <Container className="mt-4 mb-5">
        <h1 className="text-center mb-4">Weekly Time Calculator</h1>

        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Time Requirements</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Required Hours Per Day</Form.Label>
                      <Form.Control type="number" value={totalReqDay} onChange={(e) => setTotalReqDay(Number(e.target.value))} min="1" max="24" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Required Hours Per Week</Form.Label>
                      <Form.Control type="number" value={totalReqWeek} onChange={(e) => setTotalReqWeek(Number(e.target.value))} min="1" max="168" />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className={weeklyTarget ? "border-success" : "border-danger"}>
              <Card.Header className={weeklyTarget ? "bg-success text-white" : "bg-danger text-white"}>
                <h5 className="mb-0">Weekly Summary</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6>Total Time Worked</h6>
                      <h4>{formatTime(totalWeekTime)}</h4>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h6>Weekly Target</h6>
                      <h4>{formatTime(totalReqWeek)}</h4>
                    </div>
                  </Col>
                </Row>

                <div className="mt-2">
                  {weeklyTarget ? (
                    <Alert variant="success" className="mb-0">
                      You&apos;ve met your weekly target! 🎉
                    </Alert>
                  ) : (
                    <Alert variant="warning" className="mb-0">
                      You need {formatTime(totalReqWeek - totalWeekTime)} more to reach your weekly target.
                    </Alert>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card>
          <Card.Header>
            <h5 className="mb-0">Daily Time Tracker</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                  <th>Hours Worked</th>
                  <th>Extra Time</th>
                </tr>
              </thead>
              <tbody>
                {weekTimes.map((day, index) => (
                  <tr key={day.day}>
                    <td>{day.day}</td>
                    <td>
                      <InputGroup>
                        <Form.Control type="time" value={day.inTime} onChange={(e) => handleInTimeChange(index, e.target.value)} isInvalid={!isValid[index]} />
                      </InputGroup>
                    </td>
                    <td>
                      <InputGroup>
                        <Form.Control type="time" value={day.outTime} onChange={(e) => handleOutTimeChange(index, e.target.value)} isInvalid={!isValid[index]} />
                      </InputGroup>
                    </td>
                    <td className={day.bgClass}>{day.totalTime !== undefined ? day.totalTime.toFixed(2) : "0.00"} hrs</td>
                    <td>{day.extraTime || "0h 0m"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
