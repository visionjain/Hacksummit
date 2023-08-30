

const valueToNumber = (value) => {
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? 0 : numericValue;
};

// Calculate DR and balance values considering previous balance and CR
export const calculateDRAndBalance = (data, previousBalance) => {
    const totalProductAmount =
        (valueToNumber(data.Limea) * valueToNumber(data.LimeaPrice)) +
        (valueToNumber(data.Limew) * valueToNumber(data.LimewPrice)) +
        (valueToNumber(data.Limeb) * valueToNumber(data.LimebPrice)) +
        (valueToNumber(data.Limeoffw) * valueToNumber(data.LimeoffwPrice)) +
        (valueToNumber(data.jhiki) * valueToNumber(data.jhikiPrice)) +
        (valueToNumber(data.rs) * valueToNumber(data.rsPrice));
    const dr = (totalProductAmount + valueToNumber(data.autocharge) + valueToNumber(data.labourcharge)).toFixed(2);
    const balance = (previousBalance + parseFloat(dr) - parseFloat(data.cr)).toFixed(2);

    return { dr, balance };
};

