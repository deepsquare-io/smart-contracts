pragma solidity ^0.8.0;

contract Vesting {
    struct Deposit {
        uint256 start;
        uint256 slicePeriod;
        uint256 initialAmount;
        uint256 sliceAmount;
        uint256 sliceCount;
    }

    struct VestingSchedule {
        uint256 released;
        Deposit[] deposits;
    }

    mapping(address => VestingSchedule) vestingSchedules;

    constructor(){}

    function releasedAmount(address beneficiary) external view returns (uint256) {
        return vestingSchedules[beneficiary].released;
    }

    function releasableAmount(address beneficiary) external view returns (uint256) {
        uint256 releasable = vestingSchedules[beneficiary].released;
        uint256 releasableSlices = 0;
        Deposit[] deposits = vestingSchedules[beneficiary].deposits;
        for(uint i = 0; i < deposits.length; i++){
            if(deposits[i].start < block.timestamp) {
                continue;
            }
            releasableSlices = (block.timestamp - deposits[i].start) / deposits[i].slicePeriod;
            if(releasableSlices > deposits[i].sliceCount) {
                releasable -= deposits[i].initialAmount + deposits[i].sliceCount * sliceAmount;
            } else {
                releasable -= deposits[i].initialAmount + releasableSlices * sliceAmount;
            }
        }
        return releasable;
    }

    function deposit(address beneficiary, uint256 start, uint256 slicePeriod, uint256 initialAmount, uint256 sliceAmount, uint256 sliceCount) external {
        vestingSchedules[beneficiary].deposits.push(Deposit(start, slicePeriod, initialAmount, sliceAmount, slicePeriod));
    }

    function withdraw(address beneficiary, uint256 amount) external {
        require(releasableAmount(beneficiary) > amount, "Vesting: beneficiary has not enough releasable tokens");
        vestingSchedules[beneficiary].released += amount;
    }
}
