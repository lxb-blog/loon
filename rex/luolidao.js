
/**
 * 红果短剧 — Rex Widget 模块
 * 由 TVBox Python spider 转换而来：首页分类/标签筛选、分类分页、详情选集、直链播放。
 * 说明：源站未提供搜索接口，search 采用「遍历分类 + 本地标题匹配」的兜底实现。
 */

var H = 'https://dag29jmgma1g.site';
var UA = 'Mozilla/5.0 (Linux; Android 12; TFY-AN00 Build/HONORTFY-AN00; wv) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.105 Mobile Safari/537.36 ' +
  'uni-app Html5Plus/1.0 (Immersed/33.0)';
var HEADERS = { 'User-Agent': UA, 'Referer': H + '/' };

WidgetMetadata = {
  id: 'com. luolidao.lixiaobai',
  title: '萝莉岛',
  description: ' 李小白',
  site: H,
  version: '1.0.0',
  requiredVersion: '0.0.7',
  contentType: 'shortDrama',
  modules: [
    {
      id: 'categories',
      title: '分类',
      functionName: 'loadCategory',
      params: [
        {
          name: 'category',
          title: '分类',
          type: 'enumeration',
          dynamicOptions: { functionName: 'loadCategoryOptions' }
        },
        {
          name: 'class',
          title: '标签',
          type: 'enumeration',
          dynamicOptions: { functionName: 'loadTagOptions', dependsOn: ['category'] }
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    {
      id: 'loadResource',
      type: 'stream',
      title: '播放解析',
      functionName: 'loadResource',
      params: []
    }
  ],
  search: {
    id: 'search',
    title: '搜索',
    functionName: 'search',
    params: [{ name: 'keyword', title: '关键词', type: 'input' }]
  }
};

/* ---------------- 基础设施 ---------------- */

function asData(resp) {
  var d = resp && resp.data !== undefined ? resp.data : resp;
  if (typeof d === 'string') {
    try { return JSON.parse(d); } catch (e) { return {}; }
  }
  return d && typeof d === 'object' ? d : {};
}

function formBody(obj) {
  var parts = [];
  for (var k in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
    var v = obj[k] === undefined || obj[k] === null ? '' : obj[k];
    parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(v)));
  }
  return parts.join('&');
}

async function postForm(url, payload) {
  return await Widget.http.post(url, formBody(payload), {
    headers: {
      'User-Agent': UA,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  });
}

async function ensureToken() {
  var cached = Widget.storage.get('hg_token');
  if (cached) return String(cached);
  try {
    var r = await postForm(H + '/api/newreg.php', {
      device: 'android', ntoken: '', channel_code: 'vbtQg9D8'
    });
    var d = asData(r);
    var token = d && d.user && d.user.token ? String(d.user.token) : '';
    if (token) Widget.storage.set('hg_token', token);
    return token;
  } catch (e) {
    return '';
  }
}

async function getTabs() {
  var cached = Widget.storage.get('hg_tabs');
  if (cached && cached.length) return cached;
  var r = await Widget.http.get(H + '/api/setapp.php', { headers: HEADERS });
  var d = asData(r);
  var tabs = [];
  var a = Array.isArray(d.vodtab) ? d.vodtab : [];
  var b = Array.isArray(d.vodtaban) ? d.vodtaban : [];
  for (var i = 0; i < a.length; i++) tabs.push(a[i]);
  for (var j = 0; j < b.length; j++) tabs.push(b[j]);
  if (tabs.length) Widget.storage.set('hg_tabs', tabs);
  return tabs;
}

function tabOf(tabs, id) {
  for (var i = 0; i < tabs.length; i++) {
    if (String(tabs[i].type_id) === String(id)) return tabs[i];
  }
  return null;
}

/* ---------------- 列表 / 详情数据 ---------------- */

async function fetchList(tid, cls, page) {
  var pg = parseInt(page, 10) || 1;
  if (pg < 1) pg = 1;
  var token = await ensureToken();
  var r = await postForm(H + '/api/vlist.php', {
    num: String((pg - 1) * 30),
    pid: String(tid || ''),
    area: '全部',
    vodclass: String(cls || ''),
    vodyear: '全部',
    sort: '1',
    token: token
  });
  var d = asData(r);
  return Array.isArray(d.list) ? d.list : [];
}

async function fetchDetail(id) {
  var token = await ensureToken();
  var r = await postForm(H + '/api/Get_vod_list.php', {
    id: String(id || ''), token: token, channel: ''
  });
  var d = asData(r);
  return d && d.data && typeof d.data === 'object' ? d.data : d;
}

function parsePlayUrl(raw) {
  var out = [];
  String(raw || '').split('$$$').forEach(function (group) {
    group.split('#').forEach(function (seg) {
      if (!seg) return;
      var i = seg.indexOf('$');
      var name = i >= 0 ? seg.slice(0, i) : '';
      var url = i >= 0 ? seg.slice(i + 1) : seg;
      url = url.trim();
      if (/^https?:\/\//i.test(url)) out.push({ name: name, url: url });
    });
  });
  return out;
}

function episodesOf(data) {
  var eps = parsePlayUrl(data && data.vod_play_url);
  if (!eps.length && data && data.preview_url) {
    eps = parsePlayUrl('预览$' + data.preview_url);
  }
  return eps;
}

function mapListItem(item, tab) {
  var id = String(item.vod_id || '');
  return {
    id: id,
    type: 'url',
    title: String(item.vod_name || id),
    subtitle: String(item.vod_class || item.vod_remarks || ''),
    coverUrl: String(item.vod_pic || ''),
    posterPath: String(item.vod_pic || ''),
    description: String(item.vod_blurb || item.vod_content || ''),
    genreTitle: tab ? String(tab.type_name || '') : undefined,
    link: id
  };
}

/* ---------------- 动态筛选选项 ---------------- */

async function loadCategoryOptions() {
  var tabs = await getTabs();
  return tabs.map(function (t) {
    return { title: String(t.type_name || ''), value: String(t.type_id || '') };
  }).filter(function (x) { return x.value; });
}

async function loadTagOptions(params) {
  var p = typeof params === 'string' ? { category: params } : (params || {});
  var tabs = await getTabs();
  var tab = tabOf(tabs, p.category || p.pid || p.type_id || '') || tabs[0];
  var tags = tab && Array.isArray(tab.vodtags) ? tab.vodtags : [];
  var options = [{ title: '全部', value: '' }];
  tags.forEach(function (t) {
    var name = String(t.name || '');
    if (name) options.push({ title: name, value: name });
  });
  return options;
}

/* ---------------- Rex 模块入口 ---------------- */

async function loadCategory(params) {
  var p = params || {};
  var tabs = await getTabs();
  var tid = String(p.category || p.pid || p.type_id || '');
  if (!tid && tabs.length) tid = String(tabs[0].type_id);
  if (!tid) return [];
  var list = await fetchList(tid, p.class || p.vodclass || '', p.page || 1);
  var tab = tabOf(tabs, tid);
  return list.map(function (item) { return mapListItem(item, tab); });
}

async function loadDetail(link) {
  var id = String(link || '').trim();
  if (!id) return [];
  if (/^https?:\/\//i.test(id) && /\.(m3u8|mp4|flv|ts)(\?|$)/i.test(id)) {
    return {
      id: id, type: 'url', title: '播放', link: id,
      videoUrl: id, customHeaders: HEADERS, headers: HEADERS
    };
  }

  var data = await fetchDetail(id);
  var eps = episodesOf(data);
  var episodeItems = eps.map(function (e, i) {
    return {
      id: String(i + 1),
      type: 'url',
      title: String(e.name || ('第' + (i + 1) + '集')),
      videoUrl: e.url,
      customHeaders: HEADERS,
      headers: HEADERS
    };
  });

  return [{
    id: String(data.vod_id || id),
    type: 'url',
    title: String(data.vod_name || '红果短剧'),
    link: eps.length ? eps[0].url : id,
    coverUrl: String(data.vod_pic || ''),
    posterPath: String(data.vod_pic || ''),
    subtitle: String(data.vod_remarks || ''),
    description: String(data.vod_blurb || data.vod_content || data.vod_remarks || ''),
    episodeItems: episodeItems
  }];
}

async function loadResource(params) {
  var p = params || {};
  var raw = String(p.link || p.id || p.url || '').trim();
  if (!raw) return [];
  if (/^https?:\/\//i.test(raw)) {
    return [{ name: '默认', url: raw, customHeaders: HEADERS, headers: HEADERS }];
  }
  var data = await fetchDetail(raw);
  return episodesOf(data).map(function (e, i) {
    return {
      name: String(e.name || ('第' + (i + 1) + '集')),
      url: e.url,
      customHeaders: HEADERS,
      headers: HEADERS
    };
  });
}

async function search(params) {
  var p = typeof params === 'string' ? { keyword: params } : (params || {});
  var key = String(p.keyword || p.key || '').trim().toLowerCase();
  if (!key) return [];
  var tabs = await getTabs();
  var out = [];
  var limit = Math.min(tabs.length, 10);
  for (var i = 0; i < limit; i++) {
    try {
      var list = await fetchList(tabs[i].type_id, '', 1);
      for (var j = 0; j < list.length; j++) {
        if (String(list[j].vod_name || '').toLowerCase().indexOf(key) >= 0) {
          out.push(mapListItem(list[j], tabs[i]));
        }
      }
      if (out.length >= 60) break;
    } catch (e) { /* 单个分类失败不影响整体 */ }
  }
  return out.slice(0, 60);
}
