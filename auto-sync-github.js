/**
 * WANDERMATCH 3.1 — GITHUB AUTO-SYNC WATCHER
 * Tự động theo dõi mọi thay đổi code trong thư mục dự án,
 * tự động git add -> git commit -> git push lên GitHub.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT_DIR = __dirname;
const WATCH_EXTENSIONS = new Set(['.html', '.css', '.js', '.json', '.sql', '.md', '.yml']);
const IGNORE_DIRS = new Set(['.git', 'node_modules']);

let syncTimer = null;
let isSyncing = false;
let changedFiles = new Set();
let lastSyncStatus = {
  state: 'IDLE',
  lastSyncTime: new Date().toLocaleString('vi-VN'),
  lastCommitMessage: 'Sẵn sàng tự động đồng bộ khi thay đổi code',
  remoteUrl: 'https://github.com/Edtech-dev-design/wandermatch-v3.git',
  changedCount: 0
};

function runGitCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: ROOT_DIR }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        stdout: (stdout || '').trim(),
        stderr: (stderr || '').trim(),
        error
      });
    });
  });
}

function syncFrontendMirror() {
  const files = ['index.html', 'app.js', 'styles.css'];
  const frontendDir = path.join(ROOT_DIR, 'frontend');
  if (!fs.existsSync(frontendDir)) return;

  for (const f of files) {
    const rootFile = path.join(ROOT_DIR, f);
    const feFile = path.join(frontendDir, f);
    try {
      if (fs.existsSync(rootFile) && fs.existsSync(feFile)) {
        const rootStat = fs.statSync(rootFile);
        const feStat = fs.statSync(feFile);
        if (Math.abs(rootStat.mtimeMs - feStat.mtimeMs) > 1000) {
          if (rootStat.mtimeMs > feStat.mtimeMs) {
            fs.copyFileSync(rootFile, feFile);
          } else {
            fs.copyFileSync(feFile, rootFile);
          }
        }
      } else if (fs.existsSync(rootFile) && !fs.existsSync(feFile)) {
        fs.copyFileSync(rootFile, feFile);
      }
    } catch (e) {}
  }
}

async function performGitSync(triggerReason = 'Auto-watch') {
  if (isSyncing) return lastSyncStatus;
  isSyncing = true;
  lastSyncStatus.state = 'SYNCING';

  try {
    syncFrontendMirror();
    const statusRes = await runGitCommand('git status --porcelain');
    if (!statusRes.stdout) {
      lastSyncStatus.state = 'UP_TO_DATE';
      lastSyncStatus.lastSyncTime = new Date().toLocaleString('vi-VN');
      // Thử push nếu còn commit local chưa đẩy
      const pushCheck = await runGitCommand('git push -u origin main');
      if (pushCheck.ok) {
        lastSyncStatus.lastCommitMessage = 'Đã đồng bộ toàn bộ commit lên GitHub thành công';
      }
      isSyncing = false;
      return lastSyncStatus;
    }

    const filesList = Array.from(changedFiles).slice(0, 4).join(', ') || 'code files';
    changedFiles.clear();

    await runGitCommand('git add -A');
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const commitMsg = `chore(auto-sync): update ${filesList} [${timestamp}] (${triggerReason})`;
    await runGitCommand(`git commit -m "${commitMsg}"`);

    const pushRes = await runGitCommand('git push -u origin main');
    lastSyncStatus.lastSyncTime = new Date().toLocaleString('vi-VN');
    lastSyncStatus.lastCommitMessage = commitMsg;

    if (pushRes.ok) {
      lastSyncStatus.state = 'SYNCED_GITHUB';
      console.log(`✅ [GitHub Auto-Sync] Đã tự động commit & push lên GitHub: ${commitMsg}`);
    } else {
      lastSyncStatus.state = 'COMMITTED_LOCAL_PENDING_PUSH';
      lastSyncStatus.lastError = pushRes.stderr;
      console.log(`📦 [GitHub Auto-Sync] Đã tự động commit local (${commitMsg}). Đang chờ kết nối repo: ${pushRes.stderr}`);
    }
  } catch (err) {
    lastSyncStatus.state = 'ERROR';
    lastSyncStatus.lastError = err.message;
  } finally {
    isSyncing = false;
  }

  return lastSyncStatus;
}

function scheduleAutoSync(filename) {
  if (!filename) return;
  const normalized = filename.replace(/\\/g, '/');
  const firstSeg = normalized.split('/')[0];
  if (IGNORE_DIRS.has(firstSeg)) return;

  const ext = path.extname(normalized).toLowerCase();
  if (!WATCH_EXTENSIONS.has(ext)) return;

  changedFiles.add(normalized);
  lastSyncStatus.changedCount = changedFiles.size;
  lastSyncStatus.state = 'DETECTED_CHANGES';

  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    performGitSync('File-Modified');
  }, 2500);
}

function startFileWatcher() {
  try {
    fs.watch(ROOT_DIR, { recursive: true }, (eventType, filename) => {
      if (filename) {
        scheduleAutoSync(filename);
      }
    });
    console.log('🔄 [GitHub Auto-Sync] Đang theo dõi thời gian thực mọi thay đổi code để tự động commit & push lên GitHub...');
  } catch (e) {
    console.error('⚠️ Không thể khởi tạo fs.watch:', e.message);
  }

  // Tự động kiểm tra và đẩy các commit chưa push lên GitHub mỗi 15 giây
  setInterval(async () => {
    if (lastSyncStatus.state !== 'SYNCED_GITHUB' && !isSyncing) {
      const pushRes = await runGitCommand('git push -u origin main');
      if (pushRes.ok) {
        lastSyncStatus.state = 'SYNCED_GITHUB';
        lastSyncStatus.lastSyncTime = new Date().toLocaleString('vi-VN');
        lastSyncStatus.lastCommitMessage = 'Đã tự động đẩy toàn bộ mã nguồn lên GitHub thành công!';
        console.log('🎉 [GitHub Auto-Sync] Đã kết nối và đẩy toàn bộ code lên GitHub thành công!');
      }
    }
  }, 15000);
}

if (require.main === module) {
  startFileWatcher();
  performGitSync('Startup-Check');
}

module.exports = {
  startFileWatcher,
  performGitSync,
  getSyncStatus: () => lastSyncStatus
};
