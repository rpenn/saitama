import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateEvent(){
    console.log(DatePicker)
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


	let file;

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
		
		// const metadata = {
		// 	"description": description,
		// 	"external_url": null,
		// 	"image": uploadedFile.hash,
		// 	"name": name,
		// 	"attributes": []
		// }
		// console.log(file, uploadedFile.hash, metadata)
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
			<ol class="main-details">
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
				{/* <input
					id="textbox1"
					type="text"
					value={date}
					onChange={(e) => setStartDate(e.target.value)}
				/> */}
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
