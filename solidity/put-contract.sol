/**
 * available on Georli at 0x7bb05d32199119ecabde41737a3bf830c8934221
 * https://goerli.etherscan.io/address/0x7bb05d32199119ecabde41737a3bf830c8934221
*/

pragma solidity >=0.4.22;

contract EthInteraction {
    mapping(address => bytes32) public students;
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor () public {
        owner = msg.sender;
    }

    function put (string memory token) public {
        students[msg.sender] = keccak256(abi.encodePacked(token));
    }
}