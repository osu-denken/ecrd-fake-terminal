export default async (ctx, args) => {    
    const path = args[0];
    if (!path || path === '~') {
        ctx.currentDir = "~";
    } else {
        ctx.currentDir = path;
    }
}
