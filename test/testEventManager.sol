// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {EventManager} from "contracts/EventManager.sol";

contract testEventManager is Test {

    //Stores the event manager instance
    EventManager eventManager;

    //Deploys an EventManager contract
    function setUp() external {
        eventManager = new EventManager();
    }

    function testOwnerIsMsgSender() public {
        address owner = eventManager.owner();
        assertEq(owner, address(this));
    }
}