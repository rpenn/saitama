// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {EventManager} from "contracts/EventManager.sol";

contract testEventManager is Test {

    //Stores the event manager instance
    EventManager eventManager;

    //Sample event struct copy since structs ain't imported, explicit convesion required wherever used

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
}
