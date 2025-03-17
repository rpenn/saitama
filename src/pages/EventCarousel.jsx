import 'bootstrap/dist/css/bootstrap.css';
import './EventCarousel.css';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Card, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import { ethers } from 'ethers';

function EventCarousel({ allEvents }) {
    const formatDate = (timestamp) => {
        // Convert BigInt to Number for date-fns
        const date = new Date(Number(timestamp) * 1000);
        return format(date, 'MMM d, yyyy h:mm a');
    };

    const formatPrice = (price) => {
        return ethers.formatEther(price);
    };

    // Array of dummy images to cycle through
    const dummyImages = [
        '/race.jpeg',
        '/racing 1.jpeg',
        '/racing 2.jpeg'
    ];

    return (
        <Carousel className="event-carousel">
            {allEvents.map((event, index) => (
                <Carousel.Item key={index}>
                    <Container>
                        <Row className="d-flex align-items-center min-vh-50">
                            <Col md={6} className="text-start">
                                <Card className="border-0 bg-transparent">
                                    <Card.Body>
                                        <h2 className="display-5 mb-4">{event.name}</h2>
                                        
                                        <div className="mb-4">
                                            <h5 className="text-muted mb-3">Event Details</h5>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-geo-alt-fill me-2"></i>
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                <span>{formatDate(event.startTime)}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-clock me-2"></i>
                                                <span>Ends: {formatDate(event.endTime)}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-ticket-perforated me-2"></i>
                                                <span>{event.remainingTickets} tickets remaining</span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h5 className="text-muted mb-3">Description</h5>
                                            <p className="lead">{event.description}</p>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <Badge bg="primary" className="fs-5 me-3">
                                                {formatPrice(event.price)} MATIC
                                            </Badge>
                                            <button className="btn btn-primary btn-lg">
                                                Purchase Tickets
                                            </button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} className="text-center">
                                <div className="event-image-container">
                                    <img
                                        src={dummyImages[index % dummyImages.length]}
                                        alt={event.name}
                                        className="img-fluid rounded shadow"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = dummyImages[0]; // Fallback to first image
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default EventCarousel;