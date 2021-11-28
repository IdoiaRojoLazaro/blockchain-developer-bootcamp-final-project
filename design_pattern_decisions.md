# Design pattern decisions

## Access Control Design Patterns
There are some functions that will be used just for one or two of the `three roles available`(admin, seller, buyer). Access Control Design ensures that only the role/s that must perform certain operations, does so. Just the admin can close The Lazy Corner, or approve a seller, or just a seller can create notes for example. 

## Inheritance and Interfaces
`TheLazyCornerContract` inherits the OpenZeppelin library SafeMath, used to securely perform arithmetic operations such as subtract and multiply during the buy notes function.

## Fail Early and Fail Loud
The `require` keyword is used to throw as early as possible whenever certain conditions are not met, and stops further execution. It is used everywhere in the contract, especially inside modifiers. 
`revert()` is also used to stop certain operations early.

## Circuit Breaker
`TheLazyCornerContract` implements the circuit breaker pattern to give the admin the ability to stop all state-changing functionalities during emergencies and discoveries of critical bugs, such as approve seller or buy notes.