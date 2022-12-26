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

    constructor(string memory collectionName, string memory collectionSymbol)
        ERC721(collectionName, collectionSymbol)
    {}

    function addConfigLine(string memory tokenUri) private {
        configLines[configLinesCounter.current()] = tokenUri;
        configLinesCounter.increment();
    }

    function mintedTokensAmount() public view returns (uint256) {
        return _tokenIds.current();
    }

    function tokensRemainingAmount() public view returns (uint256) {
        return configLinesCounter.current();
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current() + configLinesCounter.current();
    }

    function findTokenUri() private returns (string memory) {
        string memory tokenUri = "";
        while (bytes(tokenUri).length == 0) {
            uint256 randomNumber = uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            );
            uint256 index = randomNumber % configLinesCounter.current();
            string memory indexedData = configLines[index];
            require(bytes(indexedData).length == 0, "invalid index");
            tokenUri = indexedData;
            delete configLines[index];
            configLinesCounter.decrement();
        }
        return tokenUri;
    }

    function mintNFT(address recipient) public onlyOwner returns (uint256) {
        require(tokensRemainingAmount() != 0, "minted out");
        _tokenIds.increment();

        string memory tokenUri = findTokenUri();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenUri);

        return newItemId;
    }
}
