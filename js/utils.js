export function roundToTwoDigits(number){
    return Math.round(number * 100) / 100;
}

export function capitalizeFirstLetter(str){
    return str.slice(0,1).toUpperCase() + str.slice(1);
}

export function invertArrayEntries(arr){
    return arr.map(x => {return x === 0 ? 0 : x * -1})
}