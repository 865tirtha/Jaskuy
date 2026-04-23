const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputFile = path.join(rootDir, 'laporan_kodingan_jaskuy.md');

const ignoreDirs = [
    'node_modules', '.git', 'build', 'dist', '.dart_tool', 
    'android', 'ios', 'web', 'windows', 'macos', 'linux', 
    'public', 'assets', '.next', '.expo'
];

const allowedExts = ['.js', '.dart', '.json', '.md', '.html', '.css', '.env', '.ts', '.tsx', '.jsx'];
const ignoreFiles = ['package-lock.json', 'yarn.lock', 'laporan_kodingan_jaskuy.md'];

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                getFiles(fullPath, fileList);
            }
        } else {
            const ext = path.extname(file);
            if (
                (allowedExts.includes(ext) || file.startsWith('.env')) && 
                !ignoreFiles.includes(file) && !file.includes('.log') && !file.includes('.txt')
            ) {
                fileList.push(fullPath);
            }
        }
    }
    return fileList;
}

const files = getFiles(rootDir);
let markdown = '# Laporan Kodingan Jaskuy\n\n';
markdown += '> Dokumen ini berisi kompilasi dari seluruh file kode yang ada di folder ini beserta isinya.\n\n';

markdown += '## Struktur File\n\n';
for (const file of files) {
    markdown += `- \`${path.relative(rootDir, file).replace(/\\/g, '/')}\`\n`;
}
markdown += '\n---\n\n';

markdown += '## Detail File\n\n';

for (const file of files) {
    const relativePath = path.relative(rootDir, file).replace(/\\/g, '/');
    try {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.length < 150000) {
            markdown += `### File: \`${relativePath}\`\n\n`;
            let lang = path.extname(file).replace('.', '');
            if (lang === 'js') lang = 'javascript';
            if (lang === 'ts') lang = 'typescript';
            if (file.endsWith('.env')) lang = 'env';
            markdown += `\`\`\`${lang}\n`;
            markdown += content;
            if (!content.endsWith('\n')) markdown += '\n';
            markdown += `\`\`\`\n\n`;
        } else {
             markdown += `### File: \`${relativePath}\`\n\n`;
             markdown += `*File terlalu besar untuk ditampilkan (hanya ringkasan).* \n\n`;
        }
    } catch (e) {
         markdown += `### File: \`${relativePath}\`\n\n`;
         markdown += `*Gagal membaca file.*\n\n`;
    }
}

fs.writeFileSync(outputFile, markdown);
console.log('Report generated at ' + outputFile);
