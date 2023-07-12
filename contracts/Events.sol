// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Events {
    address public immutable owner;

    mapping(uint => Event) private events;

    uint public eventIdCounter;

    struct Event {
        address creator;
        string name;
        string location;
        uint date;
        uint startTime;
        string description;
        uint eventType;
        uint price;
        uint ticketQuantity;
    }

    event CreateEvent(
        uint indexed eventId,
        address indexed creator,
        string indexed location,
        uint date,
        uint startTime,
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
        string memory description,
        uint eventType,
        uint price,
        uint ticketQuantity
    ) external returns (uint currentEventId) {
        eventIdCounter += 1;
        currentEventId = eventIdCounter;

        events[currentEventId] = Event({
            creator: msg.sender,
            name: name,
            location: location,
            date: date,
            startTime: startTime,
            description: description,
            eventType: eventType,
            price: price,
            ticketQuantity: ticketQuantity
        });

        emit CreateEvent(
            currentEventId,
            msg.sender,
            location,
            date,
            startTime,
            price
        );
        
        return currentEventId;
    }
}