// Taken from https://github.com/ethereum/solidity-examples/blob/master/src/bits/Bits.sol
// License: MIT

pragma solidity >=0.5.0 <0.6.0;
// pragma experimental "v0.5.0";
// pragma experimental "ABIEncoderV2";


library Bits128 {

    uint128 constant internal ONE = uint128(1);
    uint128 constant internal ONES = uint128(~0);

    // Sets the bit at the given 'index' in 'self' to '1'.
    // Returns the modified value.
    function setBit(uint128 self, uint8 index) internal pure returns (uint128) {
        return self | ONE << index;
    }

    // Sets the bit at the given 'index' in 'self' to '0'.
    // Returns the modified value.
    function clearBit(uint128 self, uint8 index) internal pure returns (uint128) {
        return self & ~(ONE << index);
    }

    // Sets the bit at the given 'index' in 'self' to:
    //  '1' - if the bit is '0'
    //  '0' - if the bit is '1'
    // Returns the modified value.
    function toggleBit(uint128 self, uint8 index) internal pure returns (uint128) {
        return self ^ ONE << index;
    }

    // Get the value of the bit at the given 'index' in 'self'.
    function bit(uint128 self, uint8 index) internal pure returns (uint8) {
        return uint8(self >> index & 1);
    }

    // Check if the bit at the given 'index' in 'self' is set.
    // Returns:
    //  'true' - if the value of the bit is '1'
    //  'false' - if the value of the bit is '0'
    function bitSet(uint128 self, uint8 index) internal pure returns (bool) {
        return self >> index & 1 == 1;
    }

    // Checks if the bit at the given 'index' in 'self' is equal to the corresponding
    // bit in 'other'.
    // Returns:
    //  'true' - if both bits are '0' or both bits are '1'
    //  'false' - otherwise
    function bitEqual(uint128 self, uint128 other, uint8 index) internal pure returns (bool) {
        return (self ^ other) >> index & 1 == 0;
    }

    // Get the bitwise NOT of the bit at the given 'index' in 'self'.
    function bitNot(uint128 self, uint8 index) internal pure returns (uint8) {
        return uint8(1 - (self >> index & 1));
    }

    // Computes the bitwise AND of the bit at the given 'index' in 'self', and the
    // corresponding bit in 'other', and returns the value.
    function bitAnd(uint128 self, uint128 other, uint8 index) internal pure returns (uint8) {
        return uint8((self & other) >> index & 1);
    }

    // Computes the bitwise OR of the bit at the given 'index' in 'self', and the
    // corresponding bit in 'other', and returns the value.
    function bitOr(uint128 self, uint128 other, uint8 index) internal pure returns (uint8) {
        return uint8((self | other) >> index & 1);
    }

    // Computes the bitwise XOR of the bit at the given 'index' in 'self', and the
    // corresponding bit in 'other', and returns the value.
    function bitXor(uint128 self, uint128 other, uint8 index) internal pure returns (uint8) {
        return uint8((self ^ other) >> index & 1);
    }

    // Gets 'numBits' consecutive bits from 'self', starting from the bit at 'startIndex'.
    // Returns the bits as a 'uint128'.
    // Requires that:
    //  - '0 < numBits <= 128'
    //  - 'startIndex < 128'
    //  - 'numBits + startIndex <= 128'
    function bits(uint128 self, uint8 startIndex, uint16 numBits) internal pure returns (uint128) {
        require(0 < numBits && startIndex < 128 && startIndex + numBits <= 128);
        return self >> startIndex & ONES >> 128 - numBits;
    }

    // Sets 'numBits' consecutive bits from 'self', starting from the bit at 'startIndex'.
    // Uses 'newValue' to set the bits.
    // Returns the new bitfield.
    // Requires that:
    //  - '0 < numBits <= 128'
    //  - 'startIndex < 128'
    //  - 'numBits + startIndex <= 128'
    function setBits(uint128 self, uint8 startIndex, uint16 numBits, uint128 newValue) internal pure returns (uint128) {
        require(0 < numBits && startIndex < 128 && startIndex + numBits <= 128);
        uint128 maskInv = (uint128(1) << numBits) - 1;
        uint128 newValueShifted = (newValue & maskInv) << startIndex;
        uint128 maskInvShifted = maskInv << startIndex;
        uint128 mask = ~maskInvShifted;
        uint128 selfCleared = mask & self;
        return selfCleared | newValueShifted;
    }

    // Computes the index of the highest bit set in 'self'.
    // Returns the highest bit set as an 'uint8'.
    // Requires that 'self != 0'.
    function highestBitSet(uint128 self) internal pure returns (uint8 highest) {
        require(self != 0);
        uint128 val = self;
        for (uint8 i = 128; i >= 1; i >>= 1) {
            if (val & (ONE << i) - 1 << i != 0) {
                highest += i;
                val >>= i;
            }
        }
    }

    // Computes the index of the lowest bit set in 'self'.
    // Returns the lowest bit set as an 'uint8'.
    // Requires that 'self != 0'.
    function lowestBitSet(uint128 self) internal pure returns (uint8 lowest) {
        require(self != 0);
        uint128 val = self;
        for (uint8 i = 128; i >= 1; i >>= 1) {
            if (val & (ONE << i) - 1 == 0) {
                lowest += i;
                val >>= i;
            }
        }
    }

}