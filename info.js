
function info(str) {
    let messages = [];
    switch(str) {
        case "help":
            messages.push(`Format for info: @mention info [optional: guide]\nCurrent guides: skill, raid`);
            break;
        case "skill":
            messages.push(`Skill Translation Guide: <https://docs.google.com/spreadsheets/d/1cOUORamDi90a5BqHXcHvfbWfMK48fvfWuRIegbqxVO0/>`);
            break;
        case "raid":
            messages.push(`Beelzebub Raid Guide: <https://docs.google.com/document/d/1gtI8Dg7rSPvbpdl9tgR03_xwfgIEkNev66r7jk8aeJU/>`);
            break;
        default:
            messages.push(`Skill Translation Guide: <https://docs.google.com/spreadsheets/d/1cOUORamDi90a5BqHXcHvfbWfMK48fvfWuRIegbqxVO0/>\nBeelzebub Raid Guide: <https://docs.google.com/document/d/1gtI8Dg7rSPvbpdl9tgR03_xwfgIEkNev66r7jk8aeJU/>`);
            break;
    }
    return messages;
}

//public API
module.exports.info = info;
