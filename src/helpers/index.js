import constants, { shortRealms } from "tauriprogress-constants";

export function getRealmNames(realms) {
    let realmNames = [];
    for (let realmKey in realms) {
        realmNames.push(realms[realmKey]);
    }
    return realmNames;
}

const socketInfo = {
    1: {
        icon: 1,
        desc: "Meta Socket"
    },
    2: {
        icon: 2,
        desc: "Red Socket"
    },
    4: {
        icon: 4,
        desc: "Yellow Socket"
    },
    8: {
        icon: 8,
        desc: "Blue Socket"
    }
};

export const gemColorsToSockets = {
    1: { matches: { 0: true, 1: true } },
    2: { matches: { 0: true, 2: true } },
    4: { matches: { 0: true, 4: true } },
    8: { matches: { 0: true, 8: true } },
    14: { matches: { 0: true, 8: true, 4: true, 2: true } },
    12: { matches: { 0: true, 8: true, 4: true } },
    10: { matches: { 0: true, 8: true, 2: true } },
    6: { matches: { 0: true, 4: true, 2: true } }
};

export const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
};

export const hours = new Array(24).fill(0).map((value, index) => {
    if (index === 0) {
        return "12 am";
    } else if (index === 12) {
        return "12 pm";
    } else {
        return index > 12 ? `${index - 12} pm` : `${index} am`;
    }
});

export function categorizedLogDates(logs) {
    const currentTime = new Date().getTime();
    const week = 1000 * 60 * 60 * 24 * 7;

    let dates = {};
    let dateArray = [];

    for (let log of logs) {
        const logDate = new Date(log.date * 1000);
        const latestWednesDay = getLatestWednesday(logDate);
        const weeksAgo = Math.floor(
            (currentTime - latestWednesDay.getTime()) / week
        );
        const dateText = dateTextByWeek(weeksAgo);

        if (!dates[dateText])
            dates[dateText] = {
                text: dateText,
                kills: []
            };

        dates[dateText].kills.push({
            ...log,
            dateText: dateToString(logDate),
            dateDay: days[logDate.getDay()],
            dateHours: dateTextHours(logDate)
        });
    }

    for (let date in dates) {
        dateArray.push(dates[date]);
    }

    return dateArray;
}

export function classImg(classId) {
    return require(`../assets/classes/${classId}.jpg`);
}

export function raidImg(imageName) {
    return require(`../assets/raids/${imageName}`);
}

export function getNestedObjectValue(obj, keys) {
    let currentKey = keys[0];

    if (keys.length === 1) {
        return obj.hasOwnProperty(currentKey) ? obj[currentKey] : false;
    } else {
        return obj.hasOwnProperty(currentKey)
            ? getNestedObjectValue(obj[currentKey], keys.slice(1, keys.length))
            : false;
    }
}

export function addNestedObjectValue(obj, keys, value) {
    let currentKey = keys[0];
    if (currentKey !== undefined) {
        obj[currentKey] = addNestedObjectValue(
            obj.hasOwnProperty(currentKey) ? obj[currentKey] : {},
            keys.slice(1, keys.length),
            value
        );
        return obj;
    } else {
        return value !== undefined ? value : {};
    }
}

export function convertMinutes(minutes) {
    if (minutes < 60) return `${minutes} minutes`;
    return `${Math.round(minutes / 60)} hours`;
}

export function convertFightLength(time) {
    let mins = Math.floor(time / 1000 / 60);
    let remainingSecs = Math.floor(time / 1000) - mins * 60;

    if (remainingSecs < 10) {
        remainingSecs = "0" + remainingSecs;
    }
    return `${mins}:${remainingSecs}`;
}

export function talentTreeToImage(fullSpecName, specs) {
    const regexp = new RegExp(fullSpecName, "ig");
    for (let specKey in specs) {
        if (regexp.exec(specs[specKey].label)) {
            const imageName = `${specs[specKey].image}.png`;
            return require(`../assets/specs/${imageName}`);
        }
    }

    return false;
}

export function getSpecImg(imageName) {
    return require(`../assets/specs/${imageName}.png`);
}

export function shortNumber(number) {
    if (number < 1000) {
        return Math.round(number);
    } else if (number < 1000 * 1000) {
        return `${(Math.round(number / 100) / 10).toFixed(1)}K`;
    } else {
        return `${(Math.round(number / 10000) / 100).toFixed(1)}M`;
    }
}

export function getLatestWednesday(date) {
    const currentDate = date ? date : new Date();
    const currentDay = currentDate.getDay();

    const wednesdayDaysAgo = (currentDay < 3 ? currentDay + 7 : currentDay) - 3;

    let lastWednesdayDate = currentDate.getDate() - wednesdayDaysAgo;
    if (currentDay === 3 && currentDate.getHours() < 9) {
        lastWednesdayDate -= 7;
    }

    return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        lastWednesdayDate,
        10
    );
}

export function dateToString(date) {
    return `${date.getFullYear()}-${paddingZero(
        date.getMonth() + 1,
        2
    )}-${paddingZero(date.getDate(), 2)}`;
}

export function dateTextByWeek(weeksAgo) {
    if (weeksAgo === 0) {
        return "This week";
    } else if (weeksAgo === 1) {
        return "Last week";
    } else if (weeksAgo < 5) {
        return `${weeksAgo} weeks ago`;
    } else if (weeksAgo < 9) {
        return "A month ago";
    } else if (weeksAgo < 56) {
        return `${Math.floor(weeksAgo / 4)} months ago`;
    } else if (weeksAgo < 56 * 2) {
        return "A year ago";
    } else {
        return `${Math.floor(weeksAgo / 56)} years ago`;
    }
}

export function dateTextHours(date) {
    return `${("0" + date.getHours()).slice(-2)}:${(
        "0" + date.getMinutes()
    ).slice(-2)}`;
}

export function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getSocketInfo(type) {
    if (socketInfo[type]) {
        return {
            ...socketInfo[type],
            icon: require(`../assets/tooltip/${socketInfo[type].icon}.png`)
        };
    }

    return {
        icon: false
    };
}

export function guildActivityBoundary() {
    const week = 1000 * 60 * 60 * 24 * 7;
    return getLatestWednesday(new Date(new Date().getTime() - week * 2));
}

export function shiftDays(day) {
    return day === 6 ? 0 : day + 1;
}

export function colorWeight(current, max) {
    const percent = Math.floor((current / max) * 100);
    if (percent < 20 && percent >= 1) {
        return 1;
    }

    return Math.floor(percent / 20) * 20;
}

export function validRealm(realms, realm) {
    for (let key in realms) {
        if (realms[key] === realm) {
            return true;
        }
    }

    return false;
}

export function getRealmFromLocation(location) {
    return new URLSearchParams(location.search).get("realm");
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function paddingZero(number, padding) {
    return String(number).padStart(padding, "0");
}

export function shortRealmToFull(shortRealmName) {
    for (const realmName in shortRealms) {
        if (shortRealms[realmName] === shortRealmName) {
            return realmName;
        }
    }

    return false;
}

export function getDefaultDifficulty(realmGroup) {
    return constants[realmGroup].currentContent.raids.reduce(
        (acc, raid) => {
            for (const difficulty of raid.difficulties) {
                if (
                    realmGroup !== "tauri" ? difficulty > acc : difficulty < acc
                ) {
                    acc = difficulty;
                }
            }
            return acc;
        },
        realmGroup !== "tauri" ? 0 : 10
    );
}

export function raidNameToId(raidName) {
    for (const realmGroup of ["tauri", "crystalsong"]) {
        for (const raid of constants[realmGroup].currentContent.raids) {
            if (raid.name === raidName) {
                return raid.id;
            }
        }
    }

    return false;
}
