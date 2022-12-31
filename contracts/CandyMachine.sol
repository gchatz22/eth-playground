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

    function addConfigLine(string memory tokenUri) public onlyOwner {
        configLines[configLinesCounter.current()] = tokenUri;
        configLinesCounter.increment();
    }

    function fetchConfigLines() public view returns (string[] memory) {
        string[] memory ret = new string[](configLinesCounter.current());
        for (uint256 i = 0; i < configLinesCounter.current(); i++) {
            ret[i] = configLines[i];
        }
        return ret;
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
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.difficulty,
                    block.timestamp,
                    totalSupply()
                )
            )
        );
        uint256 index = randomNumber % configLinesCounter.current();
        tokenUri = configLines[index];
        delete configLines[index];
        configLinesCounter.decrement();
        return tokenUri;
    }

    function mintNFT(address recipient) public returns (uint256) {
        require(tokensRemainingAmount() != 0, "minted out");

        string memory tokenUri = findTokenUri();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenUri);
        _tokenIds.increment();

        return newItemId;
    }
}
