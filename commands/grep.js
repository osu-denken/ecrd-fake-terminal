export default async (ctx, args) => {
    let pattern = "";
    let files = [];
    
    // Parse arguments simply, ignoring options for now
    for (const arg of args) {
        if (!arg.startsWith("-")) {
            if (!pattern) {
                pattern = arg;
                continue;
            }
            files.push(arg);
        }
    }

    if (!pattern) {
        ctx.writeLine("grep: missing operand");
        return;
    }

    let regex;
    try {
        regex = new RegExp(pattern);
    } catch (e) {
        ctx.writeLine(`grep: invalid regular expression`);
        return;
    }

    if (files.length === 0) {
        if (ctx.stdin) {
            for (const line of ctx.stdin) {
                if (regex.test(line)) {
                    ctx.writeLine(line);
                }
            }
        }
        return;
    }

    for (const file of files) {
        const content = await ctx.getFile(file);
        if (content.startsWith("cat: ")) {
            ctx.writeLine(content.replace("cat:", "grep:"));
            continue;
        }
        
        const lines = content.split('\n');
        for (const line of lines) {
            if (regex.test(line)) {
                if (files.length > 1) {
                    ctx.writeLine(`${file}:${line}`);
                    continue;
                }
                ctx.writeLine(line);
            }
        }
    }
};