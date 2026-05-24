export default async (ctx, args) => {    
    const path = args[0] || ctx.currentDir;
    if (path === '/var/www/html/' || path === '~/') {
        ctx.writeHtml(`<a class="dir" href="/about/" target="_parent">about/</a>\t<a class="dir" href="/background/" target="_parent">background/</a>\t<a class="dir" href="/blog/" target="_parent">blog/</a>\t<a href="/denken-pub.asc" target="_parent">denken-pub.asc</a>\t<a href="/favicon.ico" target="_parent">favicon.ico</a>\t<a href="/icon.png" target="_parent">icon.png</a>\t<a href="./" target="_parent">index.html</a>\t<a href="./welcome.md" target="_parent">welcome.md</a>`);
    } else {
        ctx.writeLine(`ls: cannot access '${path}': No such file or directory`);
    }
}
