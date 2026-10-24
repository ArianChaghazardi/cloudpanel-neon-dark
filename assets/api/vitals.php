<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Origin: *');

// 1. Memory Calculation (/proc/meminfo)
$meminfo = @file_get_contents('/proc/meminfo') ?: '';
$memTotal = 1;
$memAvail = 0;
if (preg_match('/MemTotal:\s+(\d+)/', $meminfo, $m)) {
    $memTotal = (int)$m[1];
}
if (preg_match('/MemAvailable:\s+(\d+)/', $meminfo, $m)) {
    $memAvail = (int)$m[1];
} elseif (preg_match('/MemFree:\s+(\d+)/', $meminfo, $mf)) {
    // Fallback if MemAvailable is missing
    $memAvail = (int)$mf[1];
}
$memUsed = max(0, $memTotal - $memAvail);
$ramPercent = round(($memUsed / max(1, $memTotal)) * 100, 1);

// 2. Disk Calculation
$diskTotal = @disk_total_space('/') ?: 1;
$diskFree = @disk_free_space('/') ?: 0;
$diskUsed = max(0, $diskTotal - $diskFree);
$diskPercent = round(($diskUsed / max(1, $diskTotal)) * 100, 1);

// 3. CPU Core Count
$cpuCores = 1;
$cpuInfo = @file_get_contents('/proc/cpuinfo') ?: '';
if (preg_match_all('/^processor/m', $cpuInfo, $matches)) {
    $cpuCores = max(1, count($matches[0]));
}

// 4. CPU Utilization (Calculated via /proc/stat delta)
$cpuPercent = 0.0;
$statFile = '/dev/shm/clp_cpu_stat';
$currentStat = @file('/proc/stat');
if ($currentStat && isset($currentStat[0])) {
    $parts = preg_split('/\s+/', trim($currentStat[0]));
    $idle = (float)($parts[4] ?? 0);
    $total = 0.0;
    for ($i = 1; $i < count($parts); $i++) {
        $total += (float)$parts[$i];
    }

    if (file_exists($statFile)) {
        $content = @file_get_contents($statFile) ?: '0 0';
        $prev = explode(' ', trim($content));
        $prevIdle = (float)($prev[0] ?? 0);
        $prevTotal = (float)($prev[1] ?? 0);
        $diffIdle = $idle - $prevIdle;
        $diffTotal = $total - $prevTotal;
        if ($diffTotal > 0) {
            $cpuPercent = max(0.0, min(100.0, (1.0 - ($diffIdle / $diffTotal)) * 100.0));
        }
    }
    @file_put_contents($statFile, "{$idle} {$total}");
}

// Fallback if CPU was not calculated on first request: use load average
$loadAvg = function_exists('sys_getloadavg') ? (sys_getloadavg() ?: [0.5, 0.5, 0.5]) : [0.5, 0.5, 0.5];
if ($cpuPercent <= 0.0) {
    $cpuPercent = max(1.0, min(100.0, ($loadAvg[0] / $cpuCores) * 100.0));
}
$cpuPercent = round($cpuPercent, 1);

// 5. System Uptime
$uptimeStr = '1 day';
$uptimeData = @file_get_contents('/proc/uptime') ?: '';
if ($uptimeData) {
    $sec = (int)floatval(explode(' ', $uptimeData)[0]);
    $days = floor($sec / 86400);
    $hours = floor(($sec % 86400) / 3600);
    $mins = floor(($sec % 3600) / 60);
    $uptimeParts = [];
    if ($days > 0) $uptimeParts[] = "{$days}d";
    if ($hours > 0) $uptimeParts[] = "{$hours}h";
    $uptimeParts[] = "{$mins}m";
    $uptimeStr = implode(' ', $uptimeParts);
}

// 6. Service Health Check (via pgrep)
$isNginx = !empty(@shell_exec('pgrep -x nginx'));
$isMysql = !empty(@shell_exec('pgrep -x mysqld || pgrep -x mariadbd'));
$isPhp = !empty(@shell_exec('pgrep -f clp-php-fpm'));

echo json_encode([
    'success' => true,
    'timestamp' => time(),
    'cpu' => [
        'percent' => $cpuPercent,
        'cores' => $cpuCores,
        'status' => $cpuPercent > 85 ? 'High Load' : ($cpuPercent > 65 ? 'Elevated' : 'Normal')
    ],
    'ram' => [
        'percent' => $ramPercent,
        'total_gb' => round($memTotal / 1048576, 1),
        'used_gb' => round($memUsed / 1048576, 1),
        'free_gb' => round($memAvail / 1048576, 1),
        'status' => $ramPercent > 85 ? 'High Memory' : 'Healthy'
    ],
    'disk' => [
        'percent' => $diskPercent,
        'total_gb' => round($diskTotal / (1024 ** 3), 1),
        'used_gb' => round($diskUsed / (1024 ** 3), 1),
        'free_gb' => round($diskFree / (1024 ** 3), 1),
        'status' => $diskPercent > 90 ? 'Critical' : 'Normal'
    ],
    'uptime' => $uptimeStr,
    'load_average' => array_map(function($v) { return round((float)$v, 2); }, $loadAvg),
    'services' => [
        'nginx' => $isNginx,
        'mysql' => $isMysql,
        'php' => $isPhp
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
