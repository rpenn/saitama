// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {TicketManager} from "contracts/TicketManager.sol";
import {EventManager} from "contracts/EventManager.sol";

contract testTicketManager is Test {

    // Stores the ticket manager instance
    TicketManager ticketManager;

    // Sample URI - this is our ticketex URI
    string constant URI = "https://storage.fleek-internal.com/513c5496-b170-498d-a846-123191d5e84f-bucket";

    function setUp() public {
        ticketManager = new TicketManager(URI);
    }

    function testCorrectURISet() public {
        assertEq(ticketManager.uri(0), URI);
    }
}