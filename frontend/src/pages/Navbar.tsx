import 'bootstrap/dist/css/bootstrap.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation()

    return (
        <Row className="pt-4">
            <Col md={4}>
                <h1><em>TicketEx</em></h1>
            </Col>
            {/* <Col md={6}>
                <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search for Movies, Events, Plays, Sports and Activities"
                    className="me-4"
                    aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
                </Form>
            </Col> */}
            {location.pathname !== "/dashboard" &&
                <Col md={2} className="text-nowrap">
                    <Link to="dashboard">
                        <Button variant="outline-success">Events</Button>
                    </Link>
                </Col>
            }
            {location.pathname !== "/create-event" &&
                <Col md={2} className="text-nowrap">
                    <Link to="create-event">
                        <Button variant="outline-success">Create Event</Button>
                    </Link>
                </Col>
            }
            {location.pathname !== "/purchase-event" &&
                <Col md={2} className="text-nowrap">
                    <Link to="purchase-event">
                        <Button variant="outline-success">Purchase Ticket</Button>
                    </Link>
                </Col>
            }
        </Row>
    );
}

export default Navbar;