// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract EventManager {
    address public immutable owner;

    mapping(uint => Event) public events;

    uint256 public currentEventId;

    struct Event {
        address creator;
        string name;
        string location;
        uint startTime;
        uint endTime;
        string description;
        uint price;
        uint ticketQuantity;
        uint remainingTickets;
    }

    event EventCreated (
        uint indexed eventId,
        address indexed creator,
        string indexed location,
        uint startTime,
        uint endTime,
        uint price
        // can add other event criteria as needed.
    );

    event EditEvent(
        uint indexed eventId,
        address indexed creator,
        string indexed location,
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
        uint startTime,
        uint endTime,
        string memory description,
        uint price,
        uint ticketQuantity
    ) external {
        currentEventId += 1;

        events[currentEventId] = Event({
            creator: msg.sender,
            name: name,
            location: location,
            startTime: startTime,
            endTime: endTime,
            description: description,
            price: price,
            ticketQuantity: ticketQuantity,
            remainingTickets: ticketQuantity
        });

        emit EventCreated (
            currentEventId,
            msg.sender,
            location,
            startTime,
            endTime,
            price
        );        
    }

    function editEvent(
        uint eventId,
        string memory name,
        string memory location,
        uint startTime,
        uint endTime,
        string memory description,
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

        if (startTime != eventToUpdate.startTime) {
            eventToUpdate.startTime = startTime;
        }

        if (endTime != eventToUpdate.endTime) {
            eventToUpdate.endTime = endTime;
        }

        if (bytes(description).length > 0 && keccak256(bytes(description)) != keccak256(bytes(eventToUpdate.description))) {
            eventToUpdate.description = description;
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
            eventToUpdate.startTime,
            eventToUpdate.endTime,
            eventToUpdate.price
        );
    }

    function getCurrentEventId() external view returns(uint256){
        return currentEventId;
    }

    function getOwner() external view returns(address) {
        return owner;
    }

    function getEvent(uint256 _currentEventId) external view returns(Event memory) {
        return events[_currentEventId];
    }
}