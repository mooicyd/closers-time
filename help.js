
function help(str) {
    switch(str) {
        case 'find':
            console.log("Printing find help");
            return [`Format for searching item: @Closers Bot#4086 find <part of item name/alias>\nUse @mention find help for more details`];
        case 'info':
            console.log("Printing info help");
            return [`Format for links: @Closers Bot#4086 info [optional: guide]\nUse @mention info help for more details`];
        default:
            console.log("Printing default help");
            return ["Format for searching item: @Closers Bot#4086 find <part of item name/alias>\nFormat for links: @Closers Bot#4086 info [optional: name of guide]\nUse '@Closers Bot#4086 <command> help' for more details on a specific command"];
    }
}


//public API
module.exports.help = help;
