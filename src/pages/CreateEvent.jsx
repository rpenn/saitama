import React, { useState, useEffect, Profiler } from "react";
import fleekStorage from "@fleekhq/fleek-storage-js";
import { ethers } from "ethers";
import DatePicker from "react-datepicker";
import ticketManagerAbi from "../../abi/TicketManager.json";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateEvent() {
	const [name, setName] = useState()
    const [location, setLocation] = useState()
    const [startTime, setStartTime] = useState(new Date())
    const [unixStartTime, setUnixStartTime] = useState()
	const [endTime, setEndTime] = useState(new Date())
    const [unixEndTime, setUnixEndTime] = useState()
	const [description, setDescription] = useState()
	const [price, setPrice] = useState()
    const [totalTickets, setTotalTickets] = useState()

	useEffect(() => {
		console.log('use effects', { name, location, startTime, description, price, totalTickets, file });
	}, [name, location, startTime, description, price, totalTickets]);

    let signer = null;
    let provider;
    let file;
	const ticketManagerAddress = import.meta.env.VITE_TICKET_MANAGER_ADDRESS;
	
	if (window.ethereum == null) {
		// If MetaMask is not installed, we use the default provider,
        console.log('MetaMask not installed; using read-only defaults');
        provider = ethers.getDefaultProvider('matic');
		
    } else {
		// Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum);
	}
	
	const ticketManagerContract = new ethers.Contract(ticketManagerAddress, ticketManagerAbi, provider);
	
	// async function getMethods() {
	// 	const id = await ticketManagerContract.getCurrentEventId();
	// 	const events = await ticketManagerContract.events(5);

	// 	console.log('id!', id);
	// 	console.log('events!', events);
	// }

	// getMethods();

	async function createEvent(name, location, startTime, endTime, description, price, totalTickets) {
		const signer = await provider.getSigner();
		const contractWithSigner = ticketManagerContract.connect(signer);

		try {
			const tx = await contractWithSigner.createEvent(name, location, startTime, endTime, description, price, totalTickets);
			const txResponse = await tx.wait();
			
			return txResponse;

		} catch (error) {
			console.error('Error interacting with the contract.', error);
		}
	}

	async function uploadIpfsFile() {
		const uploadedFile = await fleekStorage.upload({
			apiKey: import.meta.env.VITE_FLEEK_API_KEY,
			apiSecret: import.meta.env.VITE_FLEEK_API_SECRET,
			key: file.name,
			ContentType: "multipart/form-data",
			data: file,
			httpUploadProgressCallback: (event) => {
				console.log(Math.round((event.loaded / event.total) * 100) + '% done');
			},
		});
		
		const metadata = {
			"description": description,
			"external_url": null,
			"image": uploadedFile.hash,
			"name": name,
			"attributes": []
		}
		console.log(file, uploadedFile.hash, metadata)
	}

	const uploadHandler = async (e) => {
		file = e.target.files[0];
		console.log('file uploaded')
	};

	const createEventBtnHandler = async (e) => {
		e.preventDefault();

		if(!file) {
			alert('Please upload image to create your event.');
			return;
		}

		const endTime = unixStartTime + 7200;
		
		const transaction = await createEvent(name, location, unixStartTime, endTime, description, price, totalTickets);
		console.log(name, location, unixStartTime, endTime, description, price, totalTickets);

		if (transaction.status === 1) {
			console.log('Transaction sent! Hash is: ' + transaction.hash);
	
			uploadIpfsFile();
		} else {
			console.log('Transaction failed.');
		}
	};

    const dateToUnixTimestamp = date => {
        return Math.floor(date.getTime() / 1000);
    }

    const startTimeHandler = date => {
        setStartTime(date);
		let unixDate = dateToUnixTimestamp(date)
		setUnixStartTime(unixDate);

		if (date > endTime) {
			setEndTime(date);
			setUnixEndTime(unixDate);
		}
    }

	const endTimeHandler = date => {
        setEndTime(date);
        let unixDate = dateToUnixTimestamp(date)
        setUnixEndTime(unixDate);
    }

  return (
	<div>
		<form>
			<h1 id="create-new-event">Create New Event</h1>
			<ol>
				<li id="event_name">
				Event Name
				<br />
				<input
					id="textbox1"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				</li>
				<br />
                <li id="event_location">
				Event Location
				<br />
				<input
					id="textbox1"
					type="text"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>
				</li>
				<br />
                <li id="event_start_date">
				Event Start Time
				<br />
                <DatePicker
                    showTimeSelect
                    selected={startTime}
                    onChange={(startTime) => startTimeHandler(startTime)}
                    minDate={new Date()}
					dateFormat="MMMM d, yyyy h:mm aa"
                />
				</li>
				<br />
				<li id="event_end_date">
				Event End Time
				<br />
                <DatePicker
                    showTimeSelect
                    selected={endTime}
                    onChange={(endTime) => endTimeHandler(endTime)}
                    minDate={startTime}
					dateFormat="MMMM d, yyyy h:mm aa"
                />
				</li>
				<br />
				<li id="description">
					Description
					<br />
					<input
						id="textbox3"
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</li>
                <br />
                <li id="price">
				Ticket Price
				<br />
				<input
					id="textbox2"
					type="number"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
				/>
				</li>
				<br />
				<li id="ticket_quantity">
				Total Event Tickets
				<br />
				<input
					id="textbox2"
					type="number"
					value={totalTickets}
					onChange={(e) => setTotalTickets(e.target.value)}
				/>
				</li>
				<br />
				<li>
					<p>Event Image</p>
					<input
						id="upload-button-extend"
						type="file"
						onChange={uploadHandler}
					/>
					{/* </button> */}
				</li>
			</ol>
			<br />
			<br />
			<button id="mint" onClick={createEventBtnHandler}>
				Create Event
			</button>
		</form>
	</div>
  );
}
