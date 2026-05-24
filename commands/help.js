export default async (ctx, args) => {
    const helpLines = [
        "ecrd-fake-terminal, version 25.12-release",
        "These shell commands are defined internally. Type `help' to see this list.",
        "",
        " ls [path]      - List files",
        " cd [path]      - Change directory",
        " cat [file]     - Display contents of a file",
        " pwd            - Print working directory",
        " yes [string]   - Output a string repeatedly",
        " help           - Show this help message",
        " clear          - Clear the terminal",
    ];
    helpLines.forEach(line => ctx.writeLine(line));
}