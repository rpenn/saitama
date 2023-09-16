// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {EventManager} from "contracts/EventManager.sol";

contract testEventManager is Test {

    //Stores the event manager instance
    EventManager eventManager;

    //Sample addresses
    address constant USER1 = address(1);

    //Deploys an EventManager contract
    function setUp() external {
        eventManager = new EventManager();
    }

    function testOwnerIsMsgSender() public {
        address owner = eventManager.getOwner();
        assertEq(owner, address(this));
    }

    function testCreateEvent() public {
        eventManager.createEvent({
            name: "F1",
            location: "Japan Suzuka",
            date: 100,
            startTime: 200,
            endTime: 1000,
            description: "Max wins the championship",
            eventType: 1,
            price: 1e17, //corresponds to 0.1 ether
            ticketQuantity: 50000
        });

        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.creator, address(this));
        assertEq(currentEvent.name, "F1");
        assertEq(currentEvent.location, "Japan Suzuka");
        assertEq(currentEvent.date, 100);
        assertEq(currentEvent.startTime, 200);
        assertEq(currentEvent.endTime, 1000);
        assertEq(currentEvent.description, "Max wins the championship");
        assertEq(currentEvent.eventType, 1);
        assertEq(currentEvent.price, 10 ** 17);
        assertEq(currentEvent.ticketQuantity, 50000);
    }

    function testRevertIfEventIdIsLessThanCurrentEventId() public {
        testCreateEvent();
        vm.expectRevert("Event does not exist");
        eventManager.editEvent(2, "F1", "Japan Suzuka", 100, 200, 1000, "Max wins the championship", 1, 10**17, 50000);
    }

    function testRevertWhenMsgSenderIsNotCreator() public {
        testCreateEvent();
        vm.prank(USER1);
        vm.expectRevert("Only the event creator can edit the event");
        eventManager.editEvent(1, "F1", "Japan Suzuka", 100, 200, 1000, "Max wins the championship", 1, 10**17, 50000);
    }

    function testEventNameIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F2", "Japan Suzuka", 100, 200, 1000, "Max wins the championship", 1, 10**17, 50000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.name, "F2");
    }

    function testEventLocationIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F1", "Singapore GP", 100, 200, 1000, "Max wins the championship", 1, 10**17, 50000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.location, "Singapore GP");
    }

    function testEventDateIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F1", "Japan Suzuka", 150, 200, 1000, "Max wins the championship", 1, 10**17, 50000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.date, 150);
    }

    function testEventStartTimeIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F1", "Japan Suzuka", 100, 250, 1000, "Max wins the championship", 1, 10**17, 50000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.startTime, 250);
    }

    function testEventEndTimeIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F1", "Japan Suzuka", 100, 200, 1500, "Max wins the championship", 1, 10**17, 50000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.endTime, 1500);
    }

    function testEventDescriptionIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F1", "Japan Suzuka", 100, 200, 1500, "Ferrari win the championship?", 1, 10**17, 50000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.description, "Ferrari win the championship?");
    }

    function testEventEventTypeIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F1", "Japan Suzuka", 100, 200, 1000, "Max wins the championship", 2, 10**17, 50000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.eventType, 2);
    }

    function testEventPriceIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F1", "Japan Suzuka", 100, 200, 1000, "Max wins the championship", 1, 10**18, 50000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.price, 10**18);
    }

    function testEventTicketQuantityIsEditedCorrectly() public {
        testCreateEvent();
        eventManager.editEvent(1, "F1", "Japan Suzuka", 100, 200, 1000, "Max wins the championship", 1, 10**17, 60000);
        uint256 currentEventId = eventManager.getCurrentEventId();
        EventManager.Event memory currentEvent = eventManager.getEvent(currentEventId);
        assertEq(currentEvent.ticketQuantity, 60000);
    }
}
