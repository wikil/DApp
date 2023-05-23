// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

abstract contract ERC721 {
    
    /*
    from ETH official website
    */
    // event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    // event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
    // event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    // function balanceOf(address _owner)virtual external view returns (uint256);
    // function ownerOf(uint256 _tokenId)virtual external view returns (address);
    // function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data)virtual external payable;
    // function safeTransferFrom(address _from, address _to, uint256 _tokenId)virtual external payable;
    // function transferFrom(address _from, address _to, uint256 _tokenId)virtual external payable;
    // function approve(address _approved, uint256 _tokenId)virtual external payable;
    // function setApprovalForAll(address _operator, bool _approved)virtual external;
    // function getApproved(uint256 _tokenId)virtual external view returns (address);
    // function isApprovedForAll(address _owner, address _operator)virtual external view returns (bool);

    /*
    from practice website
    */
    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

    function balanceOf(address _owner)virtual public view returns (uint256 _balance);
    function ownerOf(uint256 _tokenId)virtual public view returns (address _owner);
    function transfer(address _to, uint256 _tokenId)virtual public;
    function approve(address _to, uint256 _tokenId)virtual public;
    function takeOwnership(uint256 _tokenId)virtual public;
}
