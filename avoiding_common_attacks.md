# Avoiding Common attacks

## Using Specific Compiler Pragma SWC-103
Specific compiler pragma 0.8.0 used in contracts to avoid accidental bug inclusion through outdated compiler versions. Semver_floating_pragma (>= 0.8.0)

## Use Modifiers Only for Validation
All modifiers in contract only validate data with `require` statements.

## Function Default Visibility - SWC-100
* `external` - functions called externally
* `public` - functions called externally and internally
* `private` - functions called internally

* `payable` - functions that receives payments

## State Variable Default Visibility - SWC-108
Public and private variables used.

## Avoid Using Deprecated Solidity Functions - SWC-111
Use of `revert(), view, keccak256()` instead of `throw, constant, sha3()`
## Checked Call Return Value  - SWC-104
Low-level call return value is checked to make sure to handle the possibility that the call will fail.

## Checks-Effects-Interactions Pattern - SWC-107
All internal state changes are performed before the call is executed

## Gas Limit and Loops
Loops are limited when they are needed. // TO-DO fetch in batches
## Prevent integer overflow - SWC-101
Use Openzeppelin's SafeMath library to prevent integer overflow 