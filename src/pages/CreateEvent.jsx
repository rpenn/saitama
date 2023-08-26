import React, { useState, useEffect } from "react";
import fleekStorage from "@fleekhq/fleek-storage-js";
import { ethers } from "ethers";
import dotenv from "dotenv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateEvent(){
	const [name, setName] = useState()
    const [location, setLocation] = useState()
    const [startDate, setStartDate] = useState(new Date())
    const [unixStartDate, setUnixStartDate] = useState()
	const [description, setDescription] = useState()
	const [price, setPrice] = useState()
    const [totalTickets, setTotalTickets] = useState()

	useEffect(() => {
		console.log({ name, location, startDate, description, price, totalTickets });
	}, [name, location, startDate, description, price, totalTickets]);

    let signer = null;
    let provider;
    // let providerUrl = import.meta.env.VITE_ALCHEMY_MUMBAI_URL;
    let file;
    
    if (window.ethereum == null) {

        // If MetaMask is not installed, we use the default provider,
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider();

    } else {

        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum);
        // provider = new ethers.JsonRpcProvider(providerUrl);

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        signer = provider.getSigner();
    }

	const uploadHandler = async (e) => {
		file = e.target.files[0];
	};

	const createEventBtnHandler = async (e) => {
		e.preventDefault();

		const uploadedFile = await fleekStorage.upload({
			apiKey: "Oxwo61HtXQs/jvFoPiayTg==",
			apiSecret: "7nLTggZg9mr35tM9mBv86i34nfxaOca/EeNWb6J4Rt4=",
			key: file.name,
			ContentType: "multipart/form-data",
			data: file,
			httpUploadProgressCallback: (event) => {
				console.log(Math.round((event.loaded / event.total) * 100) + "% done");
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
	};

    const dateToUnixTimestamp = date => {
        return Math.floor(date.getTime() / 1000);
    }

    const startDateHandler = date => {
        setStartDate(date);
        let unixDate = dateToUnixTimestamp(date)
        setUnixStartDate(unixDate);
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
				Event Start Date
				<br />
                <DatePicker
                    // showIcon
                    selected={startDate}
                    onChange={(startDate) => startDateHandler(startDate)}
                    minDate={new Date()}
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
					{/* <button class="upload-file"><img src="./bg-image-input.webp"/> */}
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
