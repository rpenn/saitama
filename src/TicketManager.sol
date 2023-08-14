// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./EventManager.sol";

contract TicketManager is ERC1155, ReentrancyGuard, EventManager {

    error InvalidId();
    error ExceededTicketQtyLeft();
    error InsufficientETHSent();
    error NotEnoughTickets();
    error NotCreator();
    error FailedWithdrawal();
    error OngoingEvent();

    event PurchaseSuccessful(address indexed minter, uint256 indexed eventId, uint256 indexed numOfTickets);
    event TransferSucessful(address indexed sender, address indexed recipient, uint256 indexed eventId, uint256 numOfTickets);

    modifier checkId(uint256 eventId) {
        if(eventId > currentEventId) revert InvalidId();
        _;
    }

    constructor(string memory uri_) ERC1155(uri_) {}


    function purchaseTickets(uint256 eventId, uint256 numOfTickets) external payable checkId(eventId) {
        uint256 remainingTickets = events[eventId].remainingTickets;

        if(numOfTickets > remainingTickets) revert ExceededTicketQtyLeft();
        if(msg.value < events[eventId].price * numOfTickets) revert InsufficientETHSent();
        
        events[eventId].remainingTickets = remainingTickets - numOfTickets;

        _mint(msg.sender, eventId, numOfTickets, "");

        emit PurchaseSuccessful(msg.sender, eventId, numOfTickets);
    }

    function transferTicket(address recipient, uint256 eventId, uint256 numOfTickets) external checkId(eventId) {
        if(balanceOf(msg.sender, eventId) < numOfTickets) revert NotEnoughTickets();

        safeTransferFrom(msg.sender, recipient, eventId, numOfTickets, "");

        emit TransferSucessful(msg.sender, recipient, eventId, numOfTickets);
    }
    
    // Not required for now but burning could add potential use cases ahead
    function burnTickets(address[] memory holders, uint256 eventId) external {
        Event memory tempEvent = events[eventId];
        address creator = tempEvent.creator;

        if(msg.sender != creator) revert NotCreator();
        
        for(uint i = 0 ; i < holders.length ; ++i) {
            _burn(holders[i], eventId, balanceOf(holders[i], eventId));
        }
    }

    function withdraw(uint256 eventId) external checkId(eventId) nonReentrant {
        Event memory tempEvent = events[eventId];
        address creator = tempEvent.creator;

        if(block.timestamp < tempEvent.endTime) revert OngoingEvent();
        if(msg.sender != creator) revert NotCreator();

        uint256 withdrawalAmount = (tempEvent.ticketQuantity - tempEvent.remainingTickets) * tempEvent.price;

        (bool success,) = creator.call{value: withdrawalAmount}("");
        if (!success) revert FailedWithdrawal();

        delete events[eventId];
    }
    
}