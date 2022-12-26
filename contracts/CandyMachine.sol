// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CandyMachine is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    Counters.Counter private configLinesCounter;
    mapping(uint256 => string) public configLines;

    uint256 supply;
    Counters.Counter minted;

    constructor(
        string memory collectionName,
        string memory collectionSymbol,
        uint256 _supply
    ) ERC721(collectionName, collectionSymbol) {
        supply = _supply;
    }

    function addConfigLine(string memory tokenUri) private {
        require(
            configLinesCounter.current() != supply,
            "config lines are full for the supply"
        );
        configLines[configLinesCounter.current()] = tokenUri;
        configLinesCounter.increment();
    }

    function findTokenUri() private returns (string memory) {
        string memory tokenUri = "";
        uint256 counter = 0;
        while (bytes(tokenUri).length == 0 || counter > supply) {
            uint256 randomNumber = uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            );
            uint256 index = randomNumber % (supply - minted.current());
            string memory indexedData = configLines[index];
            counter += 1;
            require(bytes(indexedData).length == 0, "invalid index");
            tokenUri = indexedData;
            delete configLines[index];
        }
        return tokenUri;
    }

    function mintNFT(address recipient) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        string memory tokenUri = findTokenUri();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenUri);

        return newItemId;
    }
}
