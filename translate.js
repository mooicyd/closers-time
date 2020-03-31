const {google} = require('googleapis');
const {RichEmbed} = require('discord.js');
const sheets = google.sheets({version: 'v4'});

exports.translate = async function(query) {
    const sheetUrl = "<https://docs.google.com/spreadsheets/d/1iLTnTcC_xJ2WfTonqusuQkCIvQsUm2GNpsxoPQ5JzDQ/edit#gid=0>";
    let results = [];

    if(query.length < 3 || query == "help") {
        return [`You may view the spreadsheet for the list of items and aliases: ${sheetUrl}\nFormat for searching item: @mention find <part of item name/alias>`];
    }
    const params = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Sheet1',
        majorDimension: 'ROWS',
        valueRenderOption: 'FORMATTED_VALUE',
        key: process.env.GOOGLE_API_KEY,
    };

    try {
        const response = (await sheets.spreadsheets.values.get(params)).data;
        if(response == null) {
            return [`Unable to find spreadsheet or spreadsheet is empty, you may access the sheet at ${sheetUrl}`];
        }

        let res_val = response["values"]
        res_val.forEach(function(element) {
            if(element[3].toLowerCase().includes(query.toLowerCase())) {
                let embed = new RichEmbed()
                .setTitle(element[1])
                .setThumbnail(element[4])
                .addField("Hangul", element[2])
                .addField("Alias(es)", element[3]);
                if(element[5]) {
                    embed.addField("Notes", element[5]);
                }
                results.push(embed);
        }});
        if(results.length == 0) {
            return [`No results found for "${query}", you may verify if the alias is found in ${sheetUrl}`];
        } else {
            results.unshift(`Matching results for "${query}":`);
            return results;
        }
    } catch (e) {
        console.log(e);
    };
}
