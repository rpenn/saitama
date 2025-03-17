import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.css';
import ticketManagerAbi from "../../abi/TicketManager.json";
import Container from 'react-bootstrap/Container';
import EventCarousel from './EventCarousel';
import { Spinner } from 'react-bootstrap';
// import EventsList from './EventsList';

export default function Dashboard() {
    const [allEvents, setAllEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    
    // Initialize provider and contract
    useEffect(() => {
        async function initializeProvider() {
            try {
                const alchemyUrl = import.meta.env.VITE_ALCHEMY_AMOY_URL;
                const contractAddress = import.meta.env.VITE_TICKET_MANAGER_ADDRESS;
                
                if (!alchemyUrl || !contractAddress) {
                    throw new Error("Missing environment variables");
                }

                // Create provider with network configuration
                const newProvider = new ethers.JsonRpcProvider(alchemyUrl, {
                    name: 'polygon-amoy',
                    chainId: 80002
                });

                // Test the provider connection
                const network = await newProvider.getNetwork();
                console.log("Provider initialized successfully, connected to:", network.name);

                const newContract = new ethers.Contract(contractAddress, ticketManagerAbi, newProvider);
                console.log("Contract initialized successfully");
                
                setProvider(newProvider);
                setContract(newContract);
            } catch (error) {
                console.error("Error initializing provider:", error);
                let errorMessage = "Failed to connect to the blockchain. ";
                
                if (error.message.includes("403")) {
                    errorMessage += "Please check your API key and permissions.";
                } else if (error.message.includes("429")) {
                    errorMessage += "Rate limit exceeded. Please try again later.";
                } else if (error.message.includes("network")) {
                    errorMessage += "Network connection issue. Please check your internet connection.";
                } else {
                    errorMessage += "Please check your configuration.";
                }
                
                setError(errorMessage);
                setIsLoading(false);
            }
        }

        initializeProvider();
    }, []);

    // Fetch events when contract is ready
    useEffect(() => {
        async function fetchEvents() {
            if (!contract) return;

            try {
                setIsLoading(true);
                setError(null);
                console.log("Fetching events...");
                
                // Test contract connection first
                const network = await contract.runner.provider.getNetwork();
                console.log("Connected to network:", network.name);
                
                const result = await contract.getAllEvents();
                console.log("Events fetched:", result);
                setAllEvents(result);
            } catch (error) {
                console.error("Error fetching contract data:", error);
                let errorMessage = "Failed to load events. ";
                
                if (error.message.includes("403")) {
                    errorMessage += "Please check your API key and permissions.";
                } else if (error.message.includes("429")) {
                    errorMessage += "Rate limit exceeded. Please try again later.";
                } else if (error.message.includes("network")) {
                    errorMessage += "Network connection issue. Please check your internet connection.";
                } else {
                    errorMessage += "Please try again later.";
                }
                
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    
        fetchEvents();
    }, [contract]);

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">Connecting to blockchain...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <h4 className="text-danger mb-3">{error}</h4>
                    <button 
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </Container>
        );
    }

    console.log("Rendering with events:", allEvents);

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 mb-3">Discover Events</h1>
                <p className="lead text-muted">Browse through our collection of exciting events</p>
            </div>
            
            {allEvents.length === 0 ? (
                <div className="text-center py-5">
                    <h3>No events available</h3>
                    <p className="text-muted">Check back later for new events!</p>
                </div>
            ) : (
                <EventCarousel allEvents={allEvents} />
            )}
        </Container>
    );
}
