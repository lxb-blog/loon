/**
 * Rex 模块 · 糖心 Vlog（只需要糖心）
 * ---------------------------------------------------------------
 * 数据链路（全明文，模块自身不需要任何解密、不需要本地后端、不需要 API Key）：
 *
 *   列表 / 分类 / 搜索  → 官网 /search-index.json（全站索引，一维数组）
 *   封面 / 播放直链     → https://t.5gcdn.xyz/videos/{id}/cover.jpg
 *                         https://t.5gcdn.xyz/videos/{id}/index.m3u8
 *   详情 / 剧照 / 推荐  → 官网 /v/{id}/ 的 VideoObject JSON-LD + article.card
 *   播放线路            → loadResource 返回两条线路给用户选
 *
 * 播放线路两种接法（全局参数里配）：
 *   1) workerApi：填你自己的 worker 明文播放接口，支持 {id} / {url} 占位。
 *      接口返回下面任意一种都会被识别：
 *        ["url1", "url2"]
 *        [{ name:"线路1", url:"..." }, { name:"线路2", m3u8_url:"..." }]
 *        { links:[...] } / { play_links:[...] } / { data:[...] }
 *        { url1:"...", url2:"..." } / { play_url:"...", url:"..." }
 *      worker 返回几条就展示几条。
 *   2) 不填 workerApi：
 *      「CDN 直连」一定有；填了 proxyBase 会再多一条「Worker 中转」。
 *      官网明文详情页只下发同一条 m3u8，因此不会摆两条一样的线路，
 *      想要真正不同的两条播放链接请用 workerApi 或 proxyBase。
 *
 * 说明：官网新站 /txapi 是 IV + AES-256-CBC(gzip(JSON)) 的双向加密，
 * Rex 脚本沙箱没有 AES / SHA / gzip / 二进制请求体，模块无法自己解密；
 * 这个模块走的是官网公开的明文索引与详情页，结果一样（封面、标题、
 * 时长、演员、标签、播放地址），但完全不需要密码学。
 *
 * 在 https://modules.rexnow.app 粘贴源码做最终检查，再导入 Rex App。
 */

var WidgetMetadata = {
  id: "com.tangxin.rex.vlog",
  title: "糖心 Vlog",
  version: "1.0.0",
  requiredVersion: "0.0.7",
  contentType: "video",
  description: "直连官网明文索引，封面 / 详情 / 搜索，点开卡片给出播放线路",
  author: "tangxin-metadata",
  globalParams: [
    { name: "siteBase", title: "官网地址", type: "input", value: "https://tangxinvlog.app",
      placeholders: [{ title: "示例", value: "https://tangxinvlog.app" }] },
    { name: "mediaBase", title: "CDN 地址", type: "input", value: "https://t.5gcdn.xyz/videos",
      placeholders: [{ title: "示例", value: "https://t.5gcdn.xyz/videos" }] },
    { name: "indexPath", title: "全站索引路径", type: "input", value: "/search-index.json",
      placeholders: [{ title: "示例", value: "/search-index.json" }] },
    { name: "workerApi", title: "Worker 播放接口", type: "input", value: "",
      description: "填 {id} / {url} 占位；留空使用内置直连线路",
      placeholders: [{ title: "示例", value: "https://your-worker.dev/play?id={id}" }] },
    { name: "proxyBase", title: "线路二代理前缀", type: "input", value: "",
      description: "可选。填了会多出一条 Worker 中转线路",
      placeholders: [{ title: "示例", value: "https://your-worker.dev/proxy?url=" }] },
    { name: "pageSize", title: "每页条数", type: "enumeration",
      enumOptions: [
        { title: "24 条", value: "24" },
        { title: "12 条", value: "12" },
        { title: "36 条", value: "36" },
        { title: "48 条", value: "48" }
      ] }
  ],
  modules: [
    { id: "latest", title: "最新", functionName: "loadList", cacheDuration: 1800,
      params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "byTag", title: "标签", functionName: "loadByTag", cacheDuration: 1800,
      params: [
        { name: "tag", title: "标签", type: "input", value: "极品",
          placeholders: [{ title: "示例", value: "极品" }] },
        { name: "page", title: "页码", type: "page" }
      ] },
    { id: "featured", title: "精选", functionName: "loadFeatured", cacheDuration: 1800,
      params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "loadResource", title: "播放线路", type: "stream", functionName: "loadResource", params: [] }
  ],
  search: {
    id: "search", title: "搜索", functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input", value: "",
        placeholders: [{ title: "示例", value: "柚子猫" }] },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

/* ---------------- 配置 ---------------- */

var DEFAULTS = {
  siteBase: "https://tangxinvlog.app",
  mediaBase: "https://t.5gcdn.xyz/videos",
  indexPath: "/search-index.json",
  workerApi: "",
  proxyBase: "",
  pageSize: "24"
};

var UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
var CONFIG_KEY = "tangxin.config";

function pick() {
  for (var i = 0; i < arguments.length; i++) {
    var v = arguments[i];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function readSaved() {
  try {
    var raw = Widget.storage.get(CONFIG_KEY);
    if (!raw) return {};
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (e) {
    return {};
  }
}

/** 入口函数拿到全局参数；loadDetail 只收 link，靠 storage + DEFAULTS 兜底。 */
function config(params) {
  var p = params || {};
  var saved = readSaved();
  var out = {};
  Object.keys(DEFAULTS).forEach(function (key) {
    out[key] = pick(p[key], saved[key], DEFAULTS[key]);
  });
  out.siteBase = out.siteBase.replace(/\/+$/, "");
  out.mediaBase = out.mediaBase.replace(/\/+$/, "");
  return out;
}

function saveConfig(cfg) {
  try { Widget.storage.set(CONFIG_KEY, JSON.stringify(cfg)); } catch (e) { /* 存储不可用时忽略 */ }
}

function headers(cfg) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/json,*/*",
    "Referer": cfg.siteBase + "/"
  };
}

/* ---------------- 通用工具 ---------------- */

function num(value, fallback) {
  var n = Number(value);
  return isFinite(n) && n > 0 ? n : fallback;
}

function pageInfo(params, cfg) {
  var page = num(params && params.page, 1);
  var size = num(cfg.pageSize, 24);
  return { page: page, size: size, start: (page - 1) * size };
}

function clip(items, info) {
  return items.slice(info.start, info.start + info.size);
}

function durationSeconds(text) {
  var parts = String(text || "").split(":").filter(function (x) { return x.trim() !== ""; });
  if (!parts.length) return 0;
  var total = 0;
  for (var i = 0; i < parts.length; i++) {
    var n = Number(parts[i]);
    if (!isFinite(n) || n < 0) return 0;
    total = total * 60 + n;
  }
  return total;
}

function isoDuration(text) {
  var m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i.exec(String(text || ""));
  if (!m) return "";
  var h = Number(m[1] || 0), mi = Number(m[2] || 0), s = Number(m[3] || 0);
  var pad = function (v) { return v < 10 ? "0" + v : String(v); };
  return h > 0 ? pad(h) + ":" + pad(mi) + ":" + pad(s) : pad(mi) + ":" + pad(s);
}

function absUrl(url, cfg) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return cfg.siteBase + (url.charAt(0) === "/" ? url : "/" + url);
}

function toItem(v, cfg) {
  var tags = (v.tags || []).filter(Boolean).map(String);
  var item = {
    id: "tx:" + v.id,
    type: "url",
    link: "tx:" + v.id,
    title: v.title || v.id,
    subtitle: [v.actor, v.duration].filter(Boolean).join(" · "),
    description: tags.join(" / "),
    coverUrl: v.cover || (cfg.mediaBase + "/" + v.id + "/cover.jpg"),
    durationText: v.duration || "",
    genreItems: tags.map(function (t) { return { id: t, title: t }; })
  };
  var seconds = durationSeconds(v.duration);
  if (seconds > 0) item.duration = seconds;
  if (v.actor) item.peoples = [{ id: v.actor, title: v.actor, role: "演员" }];
  if (v.releaseDate) item.releaseDate = v.releaseDate;
  return item;
}

/** 全站索引每行：[id, 标题, 演员, 标签[], 时长, 保留] */
function indexToVideos(rows) {
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (!Array.isArray(row) || !row[0]) continue;
    out.push({
      id: String(row[0]),
      title: String(row[1] || ""),
      actor: String(row[2] || "").replace(/^@/, ""),
      tags: Array.isArray(row[3]) ? row[3] : [],
      duration: String(row[4] || ""),
      cover: ""
    });
  }
  return out;
}

async function fetchIndex(cfg) {
  var url = cfg.siteBase + (cfg.indexPath.charAt(0) === "/" ? cfg.indexPath : "/" + cfg.indexPath);
  var response = await Widget.http.get(url, { headers: headers(cfg) });
  var rows = response.data;
  if (!Array.isArray(rows)) throw new Error("官网索引格式异常（不是数组）");
  return indexToVideos(rows);
}

/** 索引不可用时退回官网首页卡片，保证列表不会整块空白。 */
async function fetchHomeCards(cfg) {
  var response = await Widget.http.get(cfg.siteBase + "/", { headers: headers(cfg) });
  return parseCards(Widget.html.load(response.data), cfg);
}

function parseCards($, cfg) {
  var out = [];
  var seen = {};
  $("article.card").each(function () {
    var el = $(this);
    var href = el.find("a.cover-link").attr("href") || el.find("h3.title a").attr("href") || "";
    var match = /\/v\/([^/?#]+)/.exec(href);
    if (!match) return;
    var id = match[1];
    if (seen[id]) return;
    seen[id] = 1;
    var img = el.find("img").first();
    out.push({
      id: id,
      title: (el.find("h3.title a").text() || img.attr("alt") || "").trim(),
      cover: absUrl(img.attr("src"), cfg),
      duration: (el.find("span.duration").text() || "").trim(),
      actor: (el.find("a.nickname").text() || "").trim().replace(/^@/, ""),
      tags: []
    });
  });
  return out;
}

/** 索引优先，失败回落首页 HTML。 */
async function loadVideos(cfg) {
  try {
    var videos = await fetchIndex(cfg);
    if (videos.length) return videos;
  } catch (e) {
    console.log("全站索引不可用，改用官网首页：" + e.message);
  }
  return fetchHomeCards(cfg);
}

/* ---------------- 列表 / 分类 / 搜索 ---------------- */

async function loadList(params) {
  var cfg = config(params);
  saveConfig(cfg);
  var info = pageInfo(params, cfg);
  var videos = await loadVideos(cfg);
  return clip(videos.map(function (v) { return toItem(v, cfg); }), info);
}

async function loadByTag(params) {
  var cfg = config(params);
  saveConfig(cfg);
  var info = pageInfo(params, cfg);
  var tag = String((params && params.tag) || "").trim();
  if (!tag) throw new Error("请填写标签，例如：极品、内射、cospaly");
  var videos = await loadVideos(cfg);
  var matched = videos.filter(function (v) {
    return (v.tags || []).some(function (t) { return String(t).indexOf(tag) >= 0; })
      || String(v.actor).indexOf(tag) >= 0
      || String(v.title).indexOf(tag) >= 0;
  });
  if (!matched.length) throw new Error("没有找到标签「" + tag + "」相关的视频");
  return clip(matched.map(function (v) { return toItem(v, cfg); }), info);
}

async function loadFeatured(params) {
  var cfg = config(params);
  saveConfig(cfg);
  var info = pageInfo(params, cfg);
  try {
    var response = await Widget.http.get(cfg.siteBase + "/featured/", { headers: headers(cfg) });
    var cards = parseCards(Widget.html.load(response.data), cfg);
    if (cards.length) return clip(cards.map(function (v) { return toItem(v, cfg); }), info);
  } catch (e) {
    console.log("精选页不可用，改用全站索引：" + e.message);
  }
  var videos = await loadVideos(cfg);
  return clip(videos.map(function (v) { return toItem(v, cfg); }), info);
}

async function search(params) {
  var cfg = config(params);
  saveConfig(cfg);
  var info = pageInfo(params, cfg);
  var keyword = String((params && params.keyword) || "").trim();
  if (!keyword) throw new Error("请输入搜索关键词");
  var lower = keyword.toLowerCase();
  var videos = await loadVideos(cfg);
  var matched = videos.filter(function (v) {
    return String(v.title).toLowerCase().indexOf(lower) >= 0
      || String(v.actor).toLowerCase().indexOf(lower) >= 0
      || String(v.id).toLowerCase() === lower
      || (v.tags || []).some(function (t) { return String(t).toLowerCase().indexOf(lower) >= 0; });
  });
  // 纯数字/哈希 ID 直达：索引里没有也能点开
  if (!matched.length && /^[A-Za-z0-9_-]{4,}$/.test(keyword)) {
    matched = [{ id: keyword, title: keyword, actor: "", tags: [], duration: "", cover: "" }];
  }
  if (!matched.length) throw new Error("没有找到「" + keyword + "」相关的视频");
  return clip(matched.map(function (v) { return toItem(v, cfg); }), info);
}

/* ---------------- 详情 ---------------- */

async function loadDetail(link) {
  var match = /^tx:([A-Za-z0-9_-]+)$/.exec(String(link || ""));
  if (!match) throw new Error("无法识别的详情链接：" + link);
  var id = match[1];
  var cfg = config({});
  var response = await Widget.http.get(cfg.siteBase + "/v/" + encodeURIComponent(id) + "/", {
    headers: headers(cfg)
  });
  var $ = Widget.html.load(response.data);

  var vo = {};
  $("script[type='application/ld+json']").each(function () {
    try {
      var data = JSON.parse($(this).text());
      if (data && data["@type"] === "VideoObject") vo = data;
    } catch (e) { /* 忽略非 VideoObject 的结构化数据 */ }
  });

  var keywords = String(vo.keywords || "");
  var tags = keywords.split(/[,，、]/).map(function (t) { return t.trim(); }).filter(Boolean);
  var actor = (vo.creator && vo.creator.name) || "";
  var video = {
    id: id,
    title: vo.name || ($("h1").first().text() || "").trim() || id,
    cover: absUrl(vo.thumbnailUrl, cfg),
    actor: actor,
    tags: tags,
    duration: isoDuration(vo.duration),
    releaseDate: String(vo.uploadDate || "").slice(0, 10)
  };
  var item = toItem(video, cfg);
  item.description = vo.description || item.description;
  item.backdropPaths = [item.coverUrl];
  if (vo.contentUrl) item.previewUrl = String(vo.contentUrl);

  var related = parseCards($, cfg)
    .filter(function (v) { return v.id !== id; })
    .slice(0, 12)
    .map(function (v) { return toItem(v, cfg); });
  if (related.length) item.relatedItems = related;
  return item;
}

/* ---------------- 播放线路 ---------------- */

function extractId(ctx, cfg) {
  var candidates = [ctx.link, ctx.id, ctx.videoUrl, ctx.seriesName];
  for (var i = 0; i < candidates.length; i++) {
    var value = String(candidates[i] || "");
    var simple = /^tx:([A-Za-z0-9_-]+)$/.exec(value);
    if (simple) return simple[1];
    var path = /\/v\/([A-Za-z0-9_-]+)/.exec(value);
    if (path) return path[1];
    if (/^[A-Za-z0-9_-]{4,}$/.test(value) && value.indexOf("http") !== 0) return value;
  }
  throw new Error("播放上下文里没有视频 ID（link / id）");
}

function linkUrl(entry) {
  if (typeof entry === "string") return entry;
  if (!entry || typeof entry !== "object") return "";
  return String(entry.url || entry.m3u8_url || entry.play_url || entry.link || entry.videoUrl || "");
}

function linkName(entry, index) {
  if (entry && typeof entry === "object") {
    var name = String(entry.name || entry.title || entry.code || "");
    if (name) return name;
  }
  return "线路 " + (index + 1);
}

/** 兼容 worker 各种返回形态，抽成 [{name, url}]。 */
function parseWorkerLinks(data, depth) {
  depth = depth || 0;
  if (depth > 3 || !data) return [];
  if (typeof data === "string") {
    var text = data.trim();
    if (/^https?:\/\//i.test(text)) return [{ name: "线路 1", url: text }];
    try { return parseWorkerLinks(JSON.parse(text), depth + 1); } catch (e) { return []; }
  }
  if (Array.isArray(data)) {
    return data.map(function (entry, i) {
      return { name: linkName(entry, i), url: linkUrl(entry) };
    }).filter(function (x) { return /^https?:\/\//i.test(x.url); });
  }
  if (typeof data !== "object") return [];

  for (var i = 0; i < ["links", "play_links", "data", "list", "results", "streams"].length; i++) {
    var key = ["links", "play_links", "data", "list", "results", "streams"][i];
    if (data[key] !== undefined) {
      var nested = parseWorkerLinks(data[key], depth + 1);
      if (nested.length) return nested;
    }
  }
  var out = [];
  Object.keys(data).forEach(function (key) {
    if (!/(url|link|m3u8|play|src|line)/i.test(key)) return;
    var value = data[key];
    if (typeof value === "string" && /^https?:\/\//i.test(value)) {
      out.push({ name: key, url: value });
    } else if (Array.isArray(value)) {
      out = out.concat(parseWorkerLinks(value, depth + 1));
    }
  });
  return out.filter(function (x, i, arr) {
    return x.url && arr.findIndex(function (y) { return y.url === x.url; }) === i;
  });
}

function proxyUrl(base, target) {
  if (!base) return "";
  if (base.indexOf("{url}") >= 0) return base.replace(/\{url\}/g, encodeURIComponent(target));
  if (base.indexOf("{id}") >= 0) return base.replace(/\{id\}/g, target.split("/").pop());
  if (/[?&](url|u|target)=$/i.test(base) || base.charAt(base.length - 1) === "=") {
    return base + encodeURIComponent(target);
  }
  return base.replace(/\/+$/, "") + "/" + encodeURIComponent(target);
}

async function loadResource(ctx) {
  var params = ctx || {};
  var cfg = config(params);
  saveConfig(cfg);
  var id = extractId(params, cfg);
  var direct = cfg.mediaBase + "/" + id + "/index.m3u8";
  var lines = [];

  // 1. 优先请求 worker 明文播放接口，它给几条就展示几条
  if (cfg.workerApi) {
    var api = cfg.workerApi
      .replace(/\{id\}/g, encodeURIComponent(id))
      .replace(/\{url\}/g, encodeURIComponent(direct));
    try {
      var response = await Widget.http.get(api, { headers: headers(cfg) });
      lines = parseWorkerLinks(response.data);
      if (!lines.length) console.log("Worker 返回里没有可用的播放链接，回落到内置线路");
    } catch (e) {
      console.log("Worker 播放接口不可用，回落到内置线路：" + e.message);
    }
  }

  // 2. 内置两条线路：CDN 直连 + 代理/官网
  if (!lines.length) {
    lines.push({ name: "线路一 · CDN 直连", url: direct, description: "t.5gcdn.xyz 直连" });
    if (cfg.proxyBase) {
      lines.push({ name: "线路二 · Worker 中转", url: proxyUrl(cfg.proxyBase, direct),
        description: "经代理转发，CDN 被拦时用这条" });
    } else {
      try {
        var detail = await Widget.http.get(cfg.siteBase + "/v/" + encodeURIComponent(id) + "/", {
          headers: headers(cfg)
        });
        var found = /https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/.exec(String(detail.data || ""));
        // 官网明文页只下发一条 m3u8；和直连重复时不要摆两条一样的线路。
        // 想要真正不同的两条线路，请填 workerApi（worker 返回几条就展示几条）
        // 或 proxyBase（直连 + 中转）。
        if (found && found[0] !== direct) {
          lines.push({ name: "线路二 · 官网线路", url: found[0],
            description: "详情页给出的播放地址" });
        } else {
          console.log("官网只有一条 CDN 播放地址；配置 workerApi 或 proxyBase 可拿到第二条线路");
        }
      } catch (e) {
        console.log("详情页线路读取失败：" + e.message);
      }
    }
  }

  var customHeaders = {
    "Referer": cfg.siteBase + "/",
    "User-Agent": UA
  };
  return lines.map(function (line, i) {
    return {
      name: line.name || ("线路 " + (i + 1)),
      url: line.url,
      description: line.description || "",
      customHeaders: customHeaders,
      playerType: "system"
    };
  });
}
