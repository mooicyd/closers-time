const { google } = require("googleapis");
const { MessageEmbed } = require("discord.js");
const sheets = google.sheets({ version: "v4" });
const categories = [];

exports.setup = async function () {
  let params = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    key: process.env.GOOGLE_API_KEY,
  };

  let response = (await sheets.spreadsheets.get(params)).data;
  response.sheets.forEach((element) =>
    categories.push(element.properties.title)
  );
  console.log(categories);
};

exports.translate = async function (queryCommand) {
  const sheetUrl =
    "<https://docs.google.com/spreadsheets/d/1iLTnTcC_xJ2WfTonqusuQkCIvQsUm2GNpsxoPQ5JzDQ/edit#gid=0>";
  let results = [];

  if (queryCommand.length < 3 || queryCommand.startsWith("help")) {
    return [
      `You may view the spreadsheet for the list of items and aliases: ${sheetUrl}\nFormat for searching item: @Closers Bot#4086 find [category] <part of item name/alias>\nCategory defaults to "All" if there is no category`,
    ];
  }

  let spaceIndex = queryCommand.indexOf(" ");
  let category = capitaliseFirstLetter(queryCommand.substring(0, spaceIndex));
  let query = "";
  if (categories.includes(category)) {
    query = queryCommand.substring(spaceIndex + 1);
    console.log(query);
  } else {
    category = "All";
    query = queryCommand;
  }

  const params = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: category,
    majorDimension: "ROWS",
    valueRenderOption: "FORMATTED_VALUE",
    key: process.env.GOOGLE_API_KEY,
  };

  try {
    const response = (await sheets.spreadsheets.values.get(params)).data;
    if (response == null) {
      return [
        `Unable to find spreadsheet or spreadsheet is empty, you may access the sheet at ${sheetUrl}`,
      ];
    }

    let res_val = response["values"];
    res_val.forEach(function (element) {
      if (element.length === 0) {
        //skip
      } else if (element[3].toLowerCase().includes(query.toLowerCase())) {
        let embed = new MessageEmbed()
          .setTitle(element[1])
          .setThumbnail(element[4])
          .addField("Hangul", element[2])
          .addField("Alias(es)", element[3]);
        if (element[6]) {
          embed.addField("Category", element[6]);
        }
        if (element[5]) {
          embed.addField("Notes", element[5]);
        }
        results.push(embed);
      }
    });

    if (results.length == 0) {
      return [
        `No results found for "${query}" under "${category}", you may verify if the alias is found in ${sheetUrl}`,
      ];
    } else {
      results.unshift(`Matching results for "${query}" under "${category}":`);
      return results;
    }
  } catch (e) {
    console.log(e);
  }
};

function capitaliseFirstLetter([first, ...rest]) {
  return [first.toUpperCase(), ...rest].join("");
}
