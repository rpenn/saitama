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

    // Sample addresses
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

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

    function testSuccessOnTicketPurchase() public {
        testCreateEventHelper();
        bytes memory data = abi.encodeWithSignature("purchaseTickets(uint256,uint256)", 1, 10);
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        (bool success,) = address(ticketManager).call{value: 10*(10 ** 17), gas: 2000000}(data);
        assertEq(ticketManager.balanceOf(alice, 1), 10);
    }

    function testSuccessOnTicketTransfer() public {
        testSuccessOnTicketPurchase();
        vm.prank(alice);
        ticketManager.transferTicket(bob, 1, 5); //Transfers 5 tickets to bob
        assertEq(ticketManager.balanceOf(bob, 1), 5);
        assertEq(ticketManager.balanceOf(alice, 1), 5);
    }

    function testRevertWhenOwnerWithdrawsForInvalidId() public {
        testCreateEventHelper();
        vm.expectRevert();
        ticketManager.withdraw(2);
    }

    function testRevertWhenOwnerWithdrawsForOngoingEvent() public {
        testCreateEventHelper();
        vm.expectRevert();
        ticketManager.withdraw(1);
    }

    function testRevertWhenNonOwnerTriesToWithdraw() public {
        testCreateEventHelper();
        vm.warp(1 days);
        vm.prank(alice);
        vm.expectRevert();
        ticketManager.withdraw(1);
    }

    function testSuccessOnWithdraw() public {
        uint256 preBalance = address(this).balance;
        testSuccessOnTicketPurchase(); //alice buys tickets
        vm.warp(1 days); // Event is now over
        ticketManager.withdraw(1); //owner calls withdraw
        uint256 postBalance = address(this).balance;
        assertEq(postBalance - preBalance, 1e18); //alice paid 1 ether for tickets so owner receives 1 ether
    }

    receive() external payable {} // Helper function to allow receiving native tokens possible during withdrawals
}