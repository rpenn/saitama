import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.css';
import ticketManagerAbi from "../../abi/TicketManager.json";
import Container from 'react-bootstrap/Container';
import EventCarousel from './EventCarousel';
// import EventsList from './EventsList';

export default function Dashboard(){
    const [allEvents, setAllEvents] = useState()
    const events = [
        {
            id: 1,
            name: "ETHCRUNCH 2023",
            startDate: "2023-04-13 16:00:00PM",
            endDate: "2023-04-16 12:00:00PM",
            venue: "The Bunker",
            location: "Medellin, Colombia",
            imagePath: "eth"
        },
        {
            id: 2,
            name: "Rubber & Road",
            startDate: "2023-03-12 16:00:00PM ET",
            endDate: null,
            venue: "The Forest Point Fairground",
            location: "Silverstone, England",
            imagePath: "race"
        },
        {
            id: 3,
            name: "Ephemira Music Fest",
            startDate: "2023-07-01 17:00:00PM",
            endDate: null,
            venue: "Dock Beach",
            location: "Budva, Montenegro",
            imagePath: "concert"
        },
        {
            id: 4,
            name: "Rubber & Road - 2!",
            startDate: "2023-03-12 16:00:00PM ET",
            endDate: null,
            venue: "The Forest Point Fairground",
            location: "Silverstone, England",
            imagePath: "race"
        },
        {
            id: 5,
            name: "Ephemira Music Fest",
            startDate: "2023-07-01 17:00:00PM",
            endDate: null,
            venue: "Dock Beach",
            location: "Budva, Montenegro",
            imagePath: "concert"
        },
        {
            id: 6,
            name: "Rubber & Road - 3!",
            startDate: "2023-03-12 16:00:00PM ET",
            endDate: null,
            venue: "The Forest Point Fairground",
            location: "Silverstone, England",
            imagePath: "race"
        },
        {
            id: 7,
            name: "Ephemira Music Fest - 2!",
            startDate: "2023-07-01 17:00:00PM",
            endDate: null,
            venue: "Dock Beach",
            location: "Budva, Montenegro",
            imagePath: "concert"
        },
        {
            id: 8,
            name: "Rubber & Road - 4!",
            startDate: "2023-03-12 16:00:00PM ET",
            endDate: null,
            venue: "The Forest Point Fairground",
            location: "Silverstone, England",
            imagePath: "race"
        },
        {
            id: 9,
            name: "Ephemira Music Fest - 3!",
            startDate: "2023-07-01 17:00:00PM",
            endDate: null,
            venue: "Dock Beach",
            location: "Budva, Montenegro",
            imagePath: "concert"
        },
        {
            id: 10,
            name: "Rubber & Road - 5!",
            startDate: "2023-03-12 16:00:00PM ET",
            endDate: null,
            venue: "The Forest Point Fairground",
            location: "Silverstone, England",
            imagePath: "race"
        },
        {
            id: 11,
            name: "Ephemira Music Fest - 3!",
            startDate: "2023-07-01 17:00:00PM",
            endDate: null,
            venue: "Dock Beach",
            location: "Budva, Montenegro",
            imagePath: "concert"
        }
    ]
    
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_ALCHEMY_MUMBAI_URL);
	const ticketManagerAddress = import.meta.env.VITE_TICKET_MANAGER_ADDRESS;	
	const ticketManagerContract = new ethers.Contract(ticketManagerAddress, ticketManagerAbi, provider);
	
	async function getMethods() {
        // const signer = await provider.getSigner();
        console.log(ticketManagerContract);

        const id = await ticketManagerContract.getCurrentEventId();
		const event = await ticketManagerContract.events(5);
        const result = await ticketManagerContract.getAllEvents();
        setAllEvents(result);

		console.log('id!', id);
		console.log('event!', event);
	}
    
    async function getMethods() {
        // allEvents = 'yo';

		console.log('event!', allEvents);
	}

	getMethods();
    console.log('allEvents!', allEvents);
    
    return(
        <div>
        <Container>
            <h4>Yo I'm here!</h4>
            <EventCarousel events={events} allEvents={allEvents}/>
            {/* <EventsList events={events}/> */}
        </Container>
    </div>
    )
}
