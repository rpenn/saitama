// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {TicketManager} from "contracts/TicketManager.sol";
import {testEventManager} from "./testEventManager.t.sol";

contract testTicketManager is Test {

    // Stores the ticket manager instance
    TicketManager ticketManager;

    //Sample addresses
    address constant USER1 = address(1);

    // Sample URI - this is our ticketex URI
    string constant URI = "https://storage.fleek-internal.com/513c5496-b170-498d-a846-123191d5e84f-bucket/";

    function setUp() public {
        ticketManager = new TicketManager(URI);
    }

    function testCorrectURISet() public {
        assertEq(ticketManager.uri(0), URI);
    }

    function testCorrectUriReturnedForAnEvent() public {
        assertEq(ticketManager.getUri(1), string(abi.encodePacked(URI, "1")));
    }

    function testCreateEventHelper() public {
        ticketManager.createEvent({
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
    }

    function testRevertOnPurchasingTicketsForInvalidId() public {
        testCreateEventHelper();
        vm.expectRevert();
        ticketManager.purchaseTickets(2, 10);
    }

    function testRevertWhenExceededTicketQtyLeftOnPurchase() public {
        testCreateEventHelper();
        vm.expectRevert();
        ticketManager.purchaseTickets(1, 50001);
    }

    function testRevertWhenInsufficientEthSentOnPurchase() public {
        testCreateEventHelper();
        bytes memory data = abi.encodeWithSignature("purchaseTickets(uint256,uint256)", 1, 10);
        vm.txGasPrice(0);        
        vm.expectRevert();
        (bool success,) = address(ticketManager).call{value: 9*(10 ** 17), gas: 2000000}(data);
    }

    function testRevertOnTransferToERC1155ReceiverNonImplementer() public {
        testCreateEventHelper();
        bytes memory data = abi.encodeWithSignature("purchaseTickets(uint256,uint256)", 1, 10);
        vm.txGasPrice(0);        
        vm.expectRevert();
        (bool success,) = address(ticketManager).call{value: 10*(10 ** 17), gas: 2000000}(data);
    }
}