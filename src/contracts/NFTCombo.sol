// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract NFTCombo is ERC721, AccessControl {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct ComboMetadata {
        string crop;
        uint256 quantityKg;
        uint256 tco2;
        string status;
    }

    mapping(uint256 => ComboMetadata) public metadataByToken;

    constructor() ERC721("AgroChain NFT Combo", "ACNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintCombo(
        address to,
        string memory crop,
        uint256 quantityKg,
        uint256 tco2,
        string memory status
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _mint(to, tokenId);

        metadataByToken[tokenId] = ComboMetadata({
            crop: crop,
            quantityKg: quantityKg,
            tco2: tco2,
            status: status
        });

        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        ComboMetadata memory meta = metadataByToken[tokenId];

        string memory json = string(abi.encodePacked(
            '{',
                '"name": "Safra + Carbono #', tokenId.toString(), '",',
                '"description": "Certificado NFT para safra e compensacao ambiental.",',
                '"attributes": [',
                    '{"trait_type": "Cultura", "value": "', meta.crop, '"},',
                    '{"trait_type": "Quantidade (kg)", "value": "', meta.quantityKg.toString(), '"},',
                    '{"trait_type": "TCO2", "value": "', meta.tco2.toString(), '"},',
                    '{"trait_type": "Status", "value": "', meta.status, '"}',
                ']',
            '}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl, ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}