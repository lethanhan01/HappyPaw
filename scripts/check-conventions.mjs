#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const srcDir = path.join(rootDir, 'src')
const uiDir = path.join(srcDir, 'components', 'ui')

// Rules for banned raw HTML elements
const BANNED_PATTERNS = [
  {
    regex: /<button\b/g,
    name: '<button>',
    replacement: '<Btn> hoặc <IconBtn> từ @ui',
  },
  {
    regex: /<input\b/g,
    name: '<input>',
    replacement: '<Input> hoặc <Check2> từ @ui',
  },
  {
    regex: /<select\b/g,
    name: '<select>',
    replacement: '<Select> từ @ui',
  },
  {
    regex: /<textarea\b/g,
    name: '<textarea>',
    replacement: '<Textarea> từ @ui',
  },
]

// Banned external UI libraries
const BANNED_IMPORTS = [
  {
    regex: /from\s+['"](@mui|antd|@chakra-ui|@radix-ui|@headlessui)/g,
    name: 'External UI library',
    replacement: 'Cấm import thư viện UI bên ngoài! Chỉ dùng @ui và lucide-react.',
  },
]

// Banned multi-level relative imports (../../)
const BANNED_RELATIVE_IMPORTS = [
  {
    regex: /from\s+['"]\.\.\/\.\./g,
    name: 'Multi-level relative import (../../)',
    replacement: 'Cấm import lùi nhiều tầng (../../)! Sử dụng path aliases (@ui, @store, @lib, @features/*, @/*).',
  },
]

// Banned arbitrary Tailwind hex utility classes
const BANNED_HEX_CLASSES = [
  {
    regex: /\b(?:text|bg|border|fill|stroke|accent)-\[#[0-9a-fA-F]+\]/g,
    name: 'Arbitrary hex class',
    replacement: 'Cấm viết class mã màu hex dạng (text|bg|border|accent)-[#...]! Hãy sử dụng Design Tokens đã định nghĩa trong index.css (text-coral-dark, text-sage-dark, bg-map-sand, accent-brown, v.v.).',
  },
]

function getLineAndCol(content, index) {
  const lines = content.slice(0, index).split('\n')
  const line = lines.length
  const col = lines[lines.length - 1].length + 1
  return { line, col }
}

function collectSourceFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    // Exclude @ui directory as it defines the primitive layer
    if (fullPath.startsWith(uiDir)) continue
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, fileList)
    } else if (entry.isFile()) {
      if ((entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) && !entry.name.endsWith('.d.ts')) {
        fileList.push(fullPath)
      }
    }
  }
  return fileList
}

console.log('\x1b[36m%s\x1b[0m', '🔍 HappyPaw UI Conventions Linter — Đang quét toàn bộ mã nguồn...')

let totalViolations = 0
const allFiles = collectSourceFiles(srcDir)
const fileViolations = []

for (const filePath of allFiles) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/')
  const content = fs.readFileSync(filePath, 'utf-8')
  const violations = []

  // Check banned raw HTML elements
  for (const rule of BANNED_PATTERNS) {
    let match
    while ((match = rule.regex.exec(content)) !== null) {
      const { line, col } = getLineAndCol(content, match.index)
      violations.push({
        line,
        col,
        element: rule.name,
        replacement: rule.replacement,
      })
    }
  }

  // Check banned external imports
  for (const rule of BANNED_IMPORTS) {
    let match
    while ((match = rule.regex.exec(content)) !== null) {
      const { line, col } = getLineAndCol(content, match.index)
      violations.push({
        line,
        col,
        element: match[0],
        replacement: rule.replacement,
      })
    }
  }

  // Check banned multi-level relative imports
  for (const rule of BANNED_RELATIVE_IMPORTS) {
    let match
    while ((match = rule.regex.exec(content)) !== null) {
      const { line, col } = getLineAndCol(content, match.index)
      violations.push({
        line,
        col,
        element: match[0],
        replacement: rule.replacement,
      })
    }
  }

  // Check banned arbitrary hex utility classes
  for (const rule of BANNED_HEX_CLASSES) {
    let match
    while ((match = rule.regex.exec(content)) !== null) {
      const { line, col } = getLineAndCol(content, match.index)
      violations.push({
        line,
        col,
        element: match[0],
        replacement: rule.replacement,
      })
    }
  }

  if (violations.length > 0) {
    fileViolations.push({ relPath, violations })
    totalViolations += violations.length
  }
}

if (totalViolations > 0) {
  console.log('\n\x1b[31m%s\x1b[0m', `❌ Phát hiện ${totalViolations} vi phạm quy chuẩn tại ${fileViolations.length} file:`)

  for (const { relPath, violations } of fileViolations) {
    console.log(`\n  \x1b[1m\x1b[33m${relPath}\x1b[0m:`)
    for (const v of violations) {
      console.log(`    \x1b[90mDòng ${v.line}:${v.col}\x1b[0m ➔ \x1b[31m${v.element}\x1b[0m vi phạm convention!`)
      console.log(`      \x1b[32m✔ Gợi ý:\x1b[0m ${v.replacement}`)
    }
  }

  console.log('\n\x1b[31m%s\x1b[0m', 'Vui lòng sửa các vi phạm trên theo đúng tài liệu CONVENTION.md.\n')
  process.exit(1)
} else {
  console.log('\n\x1b[32m%s\x1b[0m', `✅ Tuyệt vời! Đã quét ${allFiles.length} files trong src/ (trừ @ui). 100% tuân thủ quy chuẩn UI của HappyPaw, không có lỗi nào bị phát hiện.\n`)
  process.exit(0)
}
