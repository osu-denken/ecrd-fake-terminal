import commands from "./commands/index.js"

class Terminal {
    constructor(cliElement, hiddenInputElement) {
        this.cliElement = cliElement; // ターミナル表示部の要素
        this.hiddenInputElement = hiddenInputElement; // コマンド入力用の非表示入力要素
        this.currentLine = null; // 現在の入力
        this.currentDir = "~";
        this.canInput = false;
        this.history = [];
        this.historyIndex = -1;
        this.isInterrupted = false; // 中断フラグ

        this.init();
    }

    init() {
        this.cliElement.addEventListener('click', () => {
            if (window.getSelection().toString() === "") {
                this.hiddenInputElement.focus();
            }
        });
        
        this.hiddenInputElement.addEventListener('input', this.handleInput.bind(this));
        this.hiddenInputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.playInitAnimation();
    }

    async playInitAnimation() {
        this.canInput = false;
        try {
            this.createNewLine();
            await this.sleep(500); // 500ms待機

            const initialCommands = [
                "ls /var/www/html/",
                "cd /var/www/html/",
                "cat welcome.md"
            ];

            for (const command of initialCommands) {
                this.history.push(command);
                await this.type(command, 80);
                this.currentLine.classList.remove("cursor");
                await this.executeCommand(command);
                await this.sleep(200); // 200ms待機
                if (initialCommands.indexOf(command) < initialCommands.length - 1) {
                    this.createNewLine();
                }
            }
            this.historyIndex = this.history.length;
            this.createNewLine();
        } finally {
            this.canInput = true;
            this.hiddenInputElement.focus();
        }
    }

    createNewLine() {
        if (this.currentLine) {
            this.currentLine.classList.remove("cursor");
        }
        const line = document.createElement("div");
        line.classList.add("line");
        line.innerHTML = `<span class="user">denken@osu<span class="sp">:</span>${this.currentDir}</span><span class="prefix">$&nbsp;</span><span class="text cursor"></span>`;
        this.cliElement.appendChild(line);
        this.currentLine = line.querySelector(".text");
        this.hiddenInputElement.value = '';
        window.scrollTo(0, document.body.scrollHeight);
    }
    
    async type(text, speed) {
        for (let i = 0; i < text.length; i++) {
            this.currentLine.textContent += text[i];
            await this.sleep(speed);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleInput(e) {
        if (!this.canInput) return;
        this.currentLine.textContent = e.target.value;
    }

    async handleKeyDown(e) {
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            if (!this.canInput) {
                this.isInterrupted = true;
                this.writeLine('^C');
            }
            return;
        }

        if (!this.canInput) return;
        
        switch (e.key) {
            case "Enter":
                e.preventDefault();
                this.canInput = false;
                try {
                    const text = this.hiddenInputElement.value;
                    if(text) {
                        this.history.push(text);
                        this.historyIndex = this.history.length;
                    }
                    this.currentLine.classList.remove("cursor");
                    await this.executeCommand(text);
                    this.createNewLine();
                } finally {
                    this.canInput = true;
                    this.hiddenInputElement.focus();
                }
                break;
            case "ArrowUp":
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.hiddenInputElement.value = this.history[this.historyIndex];
                    this.currentLine.textContent = this.hiddenInputElement.value;
                }
                break;
            case "ArrowDown":
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.hiddenInputElement.value = this.history[this.historyIndex];
                    this.currentLine.textContent = this.hiddenInputElement.value;
                } else {
                    this.historyIndex = this.history.length;
                    this.hiddenInputElement.value = "";
                    this.currentLine.textContent = "";
                }
                break;
            case "Tab":
                e.preventDefault();
                break;
        }
    }

    async executeCommand(commandText) {
        const [command, ...args] = commandText.trim().split(" ");
        this.isInterrupted = false;

        if (command in commands) {
            await commands[command](this, args);
        } else if(command !== "") {
            this.writeLine(`-fash: ${command}: command not found`);
        }
    }

    writeLine(text) {
        const line = document.createElement("div");
        line.classList.add("line");
        line.innerHTML = `<span class="text">${text}</span>`;
        this.cliElement.appendChild(line);
    }

    writeHtml(html) {
        const line = document.createElement("div");
        line.classList.add("line");
        line.innerHTML = `<span class="text">${html}</span>`;
        this.cliElement.appendChild(line);
    }
    
    async getFile(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                return `cat: ${path}: No such file or directory`;
            }
            return await response.text();
        } catch (error) {
            return `cat: ${path}: No such file or directory`;
        }
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

const terminal = new Terminal(
    document.querySelector('.cli'),
    document.querySelector('#terminal-input')
);