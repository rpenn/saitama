// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract EventManager {
    address public immutable owner;

    mapping(uint => Event) public events;

    uint256 public currentEventId;

    struct Event {
        address creator;
        string name;
        string location;
        uint date;
        uint startTime;
        uint endTime;
        string description;
        uint eventType;
        uint price;
        uint ticketQuantity;
        uint remainingTickets;
    }

    event EventCreated (
        uint indexed eventId,
        address indexed creator,
        string indexed location,
        uint date,
        uint startTime,
        uint endTime,
        uint price
        // can add other event criteria as needed.
    );

    event EditEvent(
        uint indexed eventId,
        address indexed creator,
        string indexed location,
        uint date,
        uint startTime,
        uint endTime,
        uint price
        // can add other event criteria as needed.
    );

    constructor() {
        owner = msg.sender;
    }

    function createEvent(
        string memory name,
        string memory location,
        uint date,
        uint startTime,
        uint endTime,
        string memory description,
        uint eventType,
        uint price,
        uint ticketQuantity
    ) external {
        currentEventId += 1;

        events[currentEventId] = Event({
            creator: msg.sender,
            name: name,
            location: location,
            date: date,
            startTime: startTime,
            endTime: endTime,
            description: description,
            eventType: eventType,
            price: price,
            ticketQuantity: ticketQuantity,
            remainingTickets: ticketQuantity
        });

        emit EventCreated (
            currentEventId,
            msg.sender,
            location,
            date,
            startTime,
            endTime,
            price
        );        
    }

    function editEvent(
        uint eventId,
        string memory name,
        string memory location,
        uint date,
        uint startTime,
        uint endTime,
        string memory description,
        uint eventType,
        // is it feasible to edit some of this stuff, post even creation? suppose tix are sold arleady?
        uint price,
        uint ticketQuantity
    ) external {
        require(eventId <= currentEventId, "Event does not exist");
        require(events[eventId].creator == msg.sender, "Only the event creator can edit the event");

        Event storage eventToUpdate = events[eventId];

        if (bytes(name).length > 0 && keccak256(bytes(name)) != keccak256(bytes(eventToUpdate.name))) {
            eventToUpdate.name = name;
        }

        if (bytes(location).length > 0 && keccak256(bytes(location)) != keccak256(bytes(eventToUpdate.location))) {
            eventToUpdate.location = location;
        }

        if (date != eventToUpdate.date) {
            eventToUpdate.date = date;
        }

        if (startTime != eventToUpdate.startTime) {
            eventToUpdate.startTime = startTime;
        }

        if (endTime != eventToUpdate.endTime) {
            eventToUpdate.endTime = endTime;
        }

        if (bytes(description).length > 0 && keccak256(bytes(description)) != keccak256(bytes(eventToUpdate.description))) {
            eventToUpdate.description = description;
        }

        if (eventType != eventToUpdate.eventType) {
            eventToUpdate.eventType = eventType;
        }

        if (price != eventToUpdate.price) {
            eventToUpdate.price = price;
        }

        if (ticketQuantity != eventToUpdate.ticketQuantity) {
            eventToUpdate.ticketQuantity = ticketQuantity;
        }

        emit EditEvent(
            eventId,
            msg.sender,
            eventToUpdate.location,
            eventToUpdate.date,
            eventToUpdate.startTime,
            eventToUpdate.endTime,
            eventToUpdate.price
        );
    }
}