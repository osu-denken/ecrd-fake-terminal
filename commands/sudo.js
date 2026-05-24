import commands from "./index.js";

export default async function (ctx, args) {
    if (args.length === 0) {
        ctx.writeLine("usage: sudo <command>");
        return;
    }

    const [cmd, ...cmdArgs] = args;

    const target = commands[cmd];

    if (!target) {
        ctx.writeLine(`sudo: ${cmd}: command not found`);
        return;
    }

    ctx.writeLine("[sudo] password for guest:");
    await new Promise(r => setTimeout(r, 800));

    ctx.writeLine("********");
    await new Promise(r => setTimeout(r, 300));

    const prev = ctx.isRoot;
    ctx.isRoot = true;

    try {
        await target(ctx, cmdArgs);
    } finally {
        ctx.isRoot = prev;
    }
}
