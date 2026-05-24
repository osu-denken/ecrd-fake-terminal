export default async (ctx, args) => {    
    if (args.length === 0) {
        if (ctx.stdin) {
            ctx.stdin.forEach(line => ctx.writeLine(line));
            continue;
        }

        ctx.writeLine("cat: missing operand");
        return;
    }
    
    for (const path of args) {
        const content = await ctx.getFile(path);
        // const escapedContent = ctx.escapeHtml(content);
        content.split('\n').forEach(line => ctx.writeLine(line));
    }
};
