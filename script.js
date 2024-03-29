if (localStorage.getItem('lang')) {
    var lang = localStorage.getItem('lang').toLowerCase();
} else {
    var lang = 'en';
}

const groupList = document.getElementById('group-list');
const body = document.querySelector('body');
const outputHeaders = document.getElementsByClassName('output-header')
const reRandomizeDescriptions = document.getElementsByClassName('re-randomize-description');

const unableToGetGroup = {};


function updateLang() {
    lang = localStorage.getItem('lang').toLowerCase();
}


function validateInput(input) {
    // Normal regex checking
    const rangeRegex = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;
    const individualSizesRegex = /^\d+(,\d+)*$/;
    const amountOrSizeRegex = /^\d+$/;
    const excludeRegex = /^((\d+(-\d+)?)(,\d+(-\d+)?)*)?$/;
    const seperateRegex = /^((\d+(,\d+)+)(\/\d+(,\d+)+)*)?$/;
    let outputString = '';
    if (input.range === '') {
        if (lang === 'th') {
            outputString += 'ไม่มีข้อมูลเลขที่ต้องการสุ่ม, ';
        } else {
            outputString += 'Range input is not present, ';
        }
    } else if (!rangeRegex.test(input.range)) {
        if (lang === 'th') {
            outputString += 'ข้อมูลเลขที่จะสุ่มไม่ถูกต้อง, ';
        } else {
            outputString += 'Range input is invalid, ';
        }
    }
    if (!input.mode) {
        if (lang === 'th') {
            outputString += 'ไม่มีข้อมูลโหมด, ';
        } else {
            outputString += 'Mode is not provided, ';
        }
    }
    if (input.value === '') {
        if (lang === 'th') {
            outputString += 'ไม่มีข้อมูลจำนวนหรือขนาดของกลุ่ม, ';
        } else {
            outputString += 'Amount/size input is not present, ';
        }
    } else if (input.mode === 'amount' || input.mode === 'size') {
        if (!amountOrSizeRegex.test(input.value)) {
            if (lang === 'th') {
                outputString += 'ข้อมูลจำนวนหรือขนาดของกลุ่มไม่ถูกต้อง, ';
            } else {
                outputString += 'Amount/size input is invalid, ';
            }
        }
    } else if (input.mode === 'individual') {
        if (!individualSizesRegex.test(input.value)) {
            if (lang === 'th') {
                outputString += 'ข้อมูลขนาดของกลุ่มแต่ละกลุ่มไม่ถูกต้อง, ';
            } else {
                outputString += 'Individual groups sizes input is invalid, ';
            }
        }
    }
    
    
    
    if (!excludeRegex.test(input.exclude)) {
        if (lang === 'th') {
            outputString += 'ข้อมูลเลขที่จะไม่สุ่มไม่ถูกต้อง, ';
        } else {
            outputString += 'Exclude input is invalid, ';
        }
    }
    if (!seperateRegex.test(input.seperate)) {
        if (lang === 'th') {
            outputString += 'ข้อมูลเลขที่จะแยกกลุ่มไม่ถูกต้อง, ';
        } else {
            outputString += 'Seperation input is invalid, ';
        }
    }
    if (outputString === '') {
        return true;
    } else {
        alert(outputString.slice(0, -2));
        return false;
    }
}


function parseRange(inputString, treatSingularInputAsAmount) {
    let numbers = [];
    let num1 = 0;
    let num2 = 0;
    const inputList = inputString.split(',');
    // If single argument was given without - an caller want this functionality, add from 1 to that number to the list
    if (inputList.length === 1 && !inputList[0].includes('-') && treatSingularInputAsAmount) {
        for (let i = 1; i <= parseInt(inputList[0]); i++) {
            numbers.push(i);
        }
    // Else either add a range of numbers corresponding to the input or a single number
    } else {
        inputList.forEach((input) => {
            if (input.includes('-')) {
                num1 = parseInt(input.split('-')[0]);
                num2 = parseInt(input.split('-')[1]);
                if (num1 > num2) {
                    [num1, num2] = [num2, num1];
                }
                for (let i = num1; i <= num2; i++) {
                    numbers.push(i);
                }
            } else {
                numbers.push(parseInt(input));
            }
        });
    }
    return numbers;
}


function parseArray(inputString) {
    const stringArray = inputString.split(',');
    let outputArray = [];
    stringArray.forEach((numChar) => {
        outputArray.push(parseInt(numChar));
    });
    return outputArray;
}


function sumArray(array) {
    // Copied from the internet, no idea how this work, it does work though
    return array.reduce((a, b) => a + b, 0);
}


function getGroupSizes(totalSize, amountOfGroup) {
    // Set all group size to smallest possible, then add one in a round robin way until condition is met
    let groupSizes = [];
    const minSize = Math.floor(totalSize/amountOfGroup);
    for (let i = 0; i < amountOfGroup; i++) {
        groupSizes.push(minSize);
    }
    let i=0;
    while (sumArray(groupSizes) < totalSize) {
        groupSizes[i%amountOfGroup] += 1;
        i++;
    }
    return groupSizes;
}


function shuffle(array) {
    // Shuffle the elements in the array, copied from the internet, again
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}


function compareArray(array1, array2) {
    // Return intersection of the 2 array, copied from the internet
    const filteredArray = array1.filter(value => array2.includes(value));
    return filteredArray;
}


function randomizeGroup(data) {
    let numbers = parseRange(data.range, true);
    console.log(`Parsed range input: ${numbers}`);
    // Remove numbers that is in the exclude input
    let excludes = parseRange(data.exclude, false);
    excludes.forEach((exclude) => {
        if (numbers.includes(exclude)) {
            numbers.splice(numbers.indexOf(exclude), 1);
        }
    });
    console.log(`Parsed range input after exclusion: ${numbers}`);
    let amountOfGroup = 0;
    // Get group sizes
    let groupSizes;
    if (data.mode === 'amount') {
        amountOfGroup = parseInt(data.value);
        groupSizes = getGroupSizes(numbers.length, amountOfGroup);
    } else if (data.mode === 'size') {
        amountOfGroup = Math.round(numbers.length/parseInt(data.value));
        groupSizes = getGroupSizes(numbers.length, amountOfGroup);
    } else {
        groupSizes = parseArray(data.value);
        if (sumArray(groupSizes) != numbers.length) {
            if (lang === 'th') {
                alert('ขนาดกลุ่มไม่ลงตัว (ขนาดของกลุ่มทุกกลุ่มรวมกันไม่เท่ากับจำนวนตัวเลขที่จะสุ่ม)');
            } else {
                alert('Group sizes inapplicable (the sum of all group sizes does not equal the amount of numbers to randomize)');
            }
            return false;
        }
    }
    console.log(`Group sizes: ${groupSizes}`);
    // Making the groups 2d array
    let groups = [];
    for (let i = 0; i < groupSizes.length; i++) {
        groups.push([]);
    }
    // Just an array of numbers 0 to number of group, use for randomizing the seperate input
    let groupNumbers = [];
    for (let i = 0; i < groupSizes.length; i++) {
        groupNumbers.push(i);
    }
    // Putting in the numbers in the seperate input
    let seperates = data.seperate.split('/');
    for (let seperateIndex = 0; seperateIndex < seperates.length; seperateIndex++) {
        let seperate = seperates[seperateIndex].split(',');
        seperate = seperate.map((x) => parseInt(x));
        // If length is 1, ignore
        if (seperate.length === 1) {
            continue;
        }
        let i = 0;
        let filled = 0;
        groupNumbers = shuffle(groupNumbers);
        // Only fill if the number in the seperate input is also in the numbers array, protect against edge cases and repeat addition
        while (filled < seperate.length) {
            if (i >= groupNumbers.length) {
                if (lang === 'th') {
                    alert('เลขที่จะแยกกลุ่มมากเกินไป ไม่สามารถสร้างกลุ่มได้ (นี่อาจเป็นผลจากโชค คุณสามารถลองสุ่มใหม่ด้วยข้อมูลเดิมได้)');
                } else {
                    alert('Too many seperate argument. Cannot generate group. (This could be due to randomness, you can try again).');
                }
                return false;
            }
            if (compareArray(groups[groupNumbers[i]], seperate).length > 0) {
                i++;
            } else {
                if (numbers.includes(seperate[filled])) {
                    groups[groupNumbers[i]].push(seperate[filled]);
                    numbers.splice(numbers.indexOf(seperate[filled]), 1);
                }
                i++;
                filled++;
            }
        }
    }
    console.log(`Groups after seperation input: ${JSON.stringify(groups)}`);
    console.log(`Parsed range after seperation: ${numbers}`);
    // Fill the rest of the space in random order
    numbers = shuffle(numbers);
    for (let i = 0; i < groups.length; i++) {
        while (groups[i].length < groupSizes[i]) {
            groups[i].push(numbers[0]);
            numbers.splice(0, 1);
        }
    }
    console.log(`Final groups data: ${JSON.stringify(groups)}`);
    return groups;
}


function updateHTMLData(groups) {
    // Append group data to the end of page
    groupList.innerHTML = '';
    groups.forEach((group, groupNumber) => {
        let li = document.createElement('li');
        let text = group.sort((a, b) => a - b).toString().replaceAll(',', ', ');
        if (lang === 'th') {
            text = `กลุ่มที่ ${groupNumber+1} : ` + text;
        } else {
            text = `Group ${groupNumber+1} : ` + text;
        }
        
        li.appendChild(document.createTextNode(text));
        groupList.appendChild(li);
    });
    // Set Output: header to be visible
    for (let outputHeader of outputHeaders) {
        outputHeader.style.opacity = 1;
    }
    // Set Group list to be visible
    groupList.style.opacity = 1;
    // Set re-randomize tip to be visible
    for (let reRandomizeDescription of reRandomizeDescriptions) {
        reRandomizeDescription.style.opacity = 1;
    }
}


document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (evt) => {
        // Prevent submitting the form to the server
        evt.preventDefault();
        console.log('Form summission catched');
        console.log(evt);
        // Format form data into dictionary
        const rawFormData = new FormData(evt.target);
        // Add radio input seperately
        const mode = evt.target.elements['mode'].value;
        let formData = {};
        rawFormData.forEach((value, key) => {
            formData[key] = value.replaceAll(' ', '');
        });
        formData.mode = mode.replaceAll(' ', '');
        console.log(`Form data is: ${JSON.stringify(formData)}`);
        // Validate input
        if (!validateInput(formData)) {
            return false;
        }
        // Basic try catch
        try {
            groups = randomizeGroup(formData);
            if (groups) {
                updateHTMLData(groups);
            } else {
                throw unableToGetGroup;
            }
        } catch (e) {
            if (e !== unableToGetGroup) {
                console.log(`The following error has occurred: ${e}`);
                if (lang === 'th') {
                    alert('เกิดข้อผิดพลาดขึ้นโดยไม่ทราบสาเหตุ เปิด console สำหรับข้อมูลเพิ่มเติน (ผู้ใช้ขั้นสูงเท่านั้น)');
                } else {
                    alert('An unknown error has occurred. Open console for more detail (advanced user only).');
                }
            } else {
                console.log('The following error has occurred: Cannot get group');
            }
        }
    });
    console.log('Form summision event listener added');
});
