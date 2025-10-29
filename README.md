# 月相计算后端 API

一个高精度的月相计算后端 API，使用 Swiss Ephemeris 和 Astronomy Engine 提供准确的月相数据、日出日落时间等信息。

## 功能特性

- 高精度月相计算（使用 Swiss Ephemeris）
- 月出月落、日出日落时间计算
- 月亮在黄道带星座的位置
- 月相照明度百分比
- 月相角度和盈亏状态
- 支持自定义地理位置
- 内置缓存机制，提高性能
- Docker 容器化部署
- 完整的 CORS 支持
- 健康检查端点

## 技术栈

- **框架**: Next.js 15 (App Router + API Routes)
- **运行时**: Node.js 20+
- **天文计算**:
  - Swiss Ephemeris (swisseph) - 高精度星历计算
  - Astronomy Engine - 日出日落计算
- **语言**: TypeScript
- **部署**: Docker + Dokploy

## API 端点

### 1. 健康检查

**GET** `/api/health`

检查 API 服务状态。

**响应示例:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600.5,
  "memory": {
    "used": 50,
    "total": 100
  },
  "environment": "production"
}
```

### 2. 获取今日月相

**GET** `/api/moon/today`

获取当前日期的月相信息。

**查询参数:**
- `date` (可选): ISO 8601 格式的日期字符串，默认为当前日期
- `timezone` (可选): 时区，默认为 UTC

**请求示例:**
```bash
curl "https://your-api.com/api/moon/today"
curl "https://your-api.com/api/moon/today?date=2024-01-01"
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "date": "2024-01-01T12:00:00.000Z",
    "phase": "waxing_gibbous",
    "phaseAngle": 135.5,
    "illumination": 85.3,
    "isWaxing": true,
    "moonPosition": {
      "longitude": 245.6,
      "latitude": 2.1,
      "distance": 0.0026
    },
    "sunPosition": {
      "longitude": 110.1,
      "latitude": 0.0,
      "distance": 0.9833
    }
  }
}
```

### 3. 获取日期详细信息

**GET** `/api/moon/day-info`

获取特定日期的详细月相信息，包括月出月落、日出日落时间。

**查询参数:**
- `date` (可选): ISO 8601 格式的日期字符串，默认为当前日期
- `latitude` (必需): 纬度 (-90 到 90)
- `longitude` (必需): 经度 (-180 到 180)

**请求示例:**
```bash
# 柏林的月相信息
curl "https://your-api.com/api/moon/day-info?latitude=52.52&longitude=13.405"

# 指定日期
curl "https://your-api.com/api/moon/day-info?date=2024-01-01&latitude=52.52&longitude=13.405"
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "date": "2024-01-01T12:00:00.000Z",
    "moonPhase": "waxing_gibbous",
    "phaseAngle": 135.5,
    "illumination": 85.3,
    "isWaxing": true,
    "moonrise": "2024-01-01T15:30:00.000Z",
    "moonset": "2024-01-01T03:45:00.000Z",
    "sunrise": "2024-01-01T07:15:00.000Z",
    "sunset": "2024-01-01T16:30:00.000Z",
    "moonPosition": {
      "longitude": 245.6,
      "latitude": 2.1,
      "distance": 0.0026
    },
    "zodiacSign": "Sagittarius"
  }
}
```

### 4. 获取月份数据

**GET** `/api/moon/month`

获取整个月的月相数据。

**查询参数:**
- `year` (必需): 年份
- `month` (必需): 月份 (0-11，0 代表一月)
- `location` (可选): 地点名称（暂未实现，使用默认柏林坐标）

**请求示例:**
```bash
# 获取 2024 年 1 月的数据
curl "https://your-api.com/api/moon/month?year=2024&month=0"
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "year": 2024,
    "month": 0,
    "days": [
      {
        "date": "2024-01-01T12:00:00.000Z",
        "moonPhase": "waxing_gibbous",
        "phaseAngle": 135.5,
        "illumination": 85.3,
        "isWaxing": true,
        "moonrise": "2024-01-01T15:30:00.000Z",
        "moonset": "2024-01-01T03:45:00.000Z",
        "sunrise": "2024-01-01T07:15:00.000Z",
        "sunset": "2024-01-01T16:30:00.000Z",
        "moonPosition": {
          "longitude": 245.6,
          "latitude": 2.1,
          "distance": 0.0026
        },
        "zodiacSign": "Sagittarius"
      }
      // ... 其他日期
    ],
    "newMoons": ["2024-01-11T12:00:00.000Z"],
    "fullMoons": ["2024-01-25T18:00:00.000Z"],
    "firstQuarters": ["2024-01-18T03:00:00.000Z"],
    "lastQuarters": ["2024-01-04T09:00:00.000Z"]
  }
}
```

### 5. 获取日期范围的月相

**GET** `/api/moon/calendar`

获取日期范围内每天的月相数据。

**查询参数:**
- `startDate` (必需): 开始日期 (ISO 8601 格式)
- `endDate` (必需): 结束日期 (ISO 8601 格式)
- 最大范围: 60 天

**请求示例:**
```bash
curl "https://your-api.com/api/moon/calendar?startDate=2024-01-01&endDate=2024-01-31"
```

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01T00:00:00.000Z",
      "phase": "waxing_gibbous",
      "phaseAngle": 135.5,
      "illumination": 85.3,
      "isWaxing": true,
      "moonLongitude": 245.6,
      "moonLatitude": 2.1,
      "sunLongitude": 110.1
    }
    // ... 其他日期
  ],
  "count": 31
}
```

## 月相类型

API 返回以下月相类型：

- `new_moon`: 新月
- `waxing_crescent`: 娥眉月（上弦）
- `first_quarter`: 上弦月
- `waxing_gibbous`: 盈凸月（上弦）
- `full_moon`: 满月
- `waning_gibbous`: 亏凸月（下弦）
- `last_quarter`: 下弦月
- `waning_crescent`: 残月（下弦）

## 黄道星座

月亮在黄道带的位置会返回以下星座之一：

- Aries (白羊座)
- Taurus (金牛座)
- Gemini (双子座)
- Cancer (巨蟹座)
- Leo (狮子座)
- Virgo (处女座)
- Libra (天秤座)
- Scorpio (天蝎座)
- Sagittarius (射手座)
- Capricorn (摩羯座)
- Aquarius (水瓶座)
- Pisces (双鱼座)

## 错误响应

所有端点在出错时返回标准错误格式：

```json
{
  "success": false,
  "error": "错误描述信息"
}
```

常见错误状态码：
- `400`: 请求参数错误
- `500`: 服务器内部错误

## 本地开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

API 将在 http://localhost:3000 运行。

### 类型检查

```bash
npm run type-check
```

### 构建

```bash
npm run build
```

### 生产模式

```bash
npm run start
```

## Docker 部署

### 使用 Docker Compose

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### 使用 Dockerfile

```bash
# 构建镜像
docker build -t mondkalender-api .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e ALLOWED_ORIGIN=https://your-frontend.com \
  --name moon-api \
  mondkalender-api

# 查看日志
docker logs -f moon-api
```

## Dokploy 部署

详细的 Dokploy 部署指南请参见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 快速开始

1. 将代码推送到 Git 仓库
2. 在 Dokploy 中创建新应用
3. 连接 Git 仓库
4. 配置环境变量：
   ```env
   NODE_ENV=production
   PORT=3000
   ALLOWED_ORIGIN=https://your-frontend.com
   ```
5. 点击部署

## 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGIN=https://your-frontend.com
NEXT_TELEMETRY_DISABLED=1
```

## 前端集成示例

### JavaScript/TypeScript

```typescript
// API 客户端
class MoonAPI {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getTodayMoonPhase() {
    const response = await fetch(`${this.baseUrl}/api/moon/today`);
    return response.json();
  }

  async getDayInfo(date: string, lat: number, lon: number) {
    const params = new URLSearchParams({
      date,
      latitude: lat.toString(),
      longitude: lon.toString(),
    });
    const response = await fetch(
      `${this.baseUrl}/api/moon/day-info?${params}`
    );
    return response.json();
  }

  async getMonthData(year: number, month: number) {
    const params = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
    });
    const response = await fetch(
      `${this.baseUrl}/api/moon/month?${params}`
    );
    return response.json();
  }

  async getCalendar(startDate: string, endDate: string) {
    const params = new URLSearchParams({ startDate, endDate });
    const response = await fetch(
      `${this.baseUrl}/api/moon/calendar?${params}`
    );
    return response.json();
  }
}

// 使用示例
const api = new MoonAPI('https://your-api.com');

// 获取今日月相
const today = await api.getTodayMoonPhase();
console.log(`今日月相: ${today.data.phase}`);
console.log(`照明度: ${today.data.illumination.toFixed(1)}%`);

// 获取特定位置的详细信息
const dayInfo = await api.getDayInfo(
  '2024-01-01',
  52.52,  // 柏林纬度
  13.405  // 柏林经度
);
console.log(`月出时间: ${dayInfo.data.moonrise}`);
console.log(`星座: ${dayInfo.data.zodiacSign}`);
```

### React Hook 示例

```typescript
import { useState, useEffect } from 'react';

export function useMoonPhase(date?: Date) {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMoonData() {
      try {
        setLoading(true);
        const dateParam = date ? `?date=${date.toISOString()}` : '';
        const response = await fetch(
          `https://your-api.com/api/moon/today${dateParam}`
        );
        const data = await response.json();

        if (data.success) {
          setMoonData(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMoonData();
  }, [date]);

  return { moonData, loading, error };
}

// 使用
function MoonPhaseDisplay() {
  const { moonData, loading, error } = useMoonPhase();

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <h2>今日月相</h2>
      <p>月相: {moonData.phase}</p>
      <p>照明度: {moonData.illumination.toFixed(1)}%</p>
      <p>状态: {moonData.isWaxing ? '渐盈' : '渐亏'}</p>
    </div>
  );
}
```

## 性能和缓存

- 月相数据自动缓存 24 小时
- 相同参数的请求会直接返回缓存数据
- 缓存键基于日期和地理位置
- 过期缓存每小时自动清理

## 限制说明

- 日期范围查询最大 60 天
- 建议对频繁请求的数据在前端也进行缓存
- API 是无状态的，可以水平扩展

## 项目结构

```
mondkalender-api/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── health/         # 健康检查
│   │       └── moon/           # 月相 API
│   │           ├── calendar/   # 日期范围查询
│   │           ├── day-info/   # 日期详细信息
│   │           ├── month/      # 月份数据
│   │           └── today/      # 今日月相
│   ├── lib/
│   │   ├── cache.ts           # 缓存实现
│   │   └── lunar-accurate.ts  # 月相计算
│   ├── services/
│   │   └── ephemeris/
│   │       └── swisseph-loader.ts  # Swiss Ephemeris 加载器
│   ├── types/
│   │   └── moon.ts            # 类型定义
│   └── middleware.ts          # CORS 中间件
├── Dockerfile                 # Docker 配置
├── docker-compose.yml         # Docker Compose 配置
├── next.config.js            # Next.js 配置
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
├── DEPLOYMENT.md             # 部署指南
└── README.md                 # 本文件
```

## 许可证

本项目用于月相计算服务。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如有问题，请查看：
1. [API 文档](#api-端点)
2. [部署指南](./DEPLOYMENT.md)
3. GitHub Issues
