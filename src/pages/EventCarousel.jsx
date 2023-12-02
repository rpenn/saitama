import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CarouselItem from 'react-bootstrap/esm/CarouselItem';


function EventCarousel(props) {
    const events = props.events;
    const allEvents = props.allEvents;
    console.log('this is them!', allEvents)

    return (
        <Row className="mt-5">
            <Carousel>
                {events.map((event) =>
                    <CarouselItem key={event.id}>
                        <Container>
                            <Row className="d-flex align-items-center">
                            <Col sm={6} className="text-center align-items-center">
                                <h4>{event.name}</h4>
                                <h4>{event.startDate}</h4>
                                <h4>{event.venue}</h4>
                                <h4>{event.location}</h4>
                            </Col>
                            <Col sm={6}>
                                <img
                                className="d-block h-100 w-100"
                                // src={require(`./${event.imagePath}.jpeg`)}
                                alt="First Slide"
                                />
                            </Col>
                            </Row>
                        </Container>
                    </CarouselItem>
                )}
            </Carousel>
        </Row>
    );
}

export default EventCarousel;