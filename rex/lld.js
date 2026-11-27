

var H = 'https://dag29jmgma1g.site';
var UA = 'Mozilla/5.0 (Linux; Android 12; TFY-AN00 Build/HONORTFY-AN00; wv) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.105 Mobile Safari/537.36 ' +
  'uni-app Html5Plus/1.0 (Immersed/33.0)';
var HEADERS = { 'User-Agent': UA, 'Referer': H + '/' };

/* ===== 功能块 0：手动配置区 =====
 * 分类的 value  = /api/setapp.php 返回的 vodtab[].type_id（字符串）
 * 标签的 value  = vodtab[].vodtags[].name（字符串）
 * 排序的 value  = /api/vlist.php 的 sort 字段，原脚本写死 "1"
 * 填写格式见下面每个 enumOptions 里的注释。
 */
var SEARCH_CATEGORY_IDS = ['']; // 搜索时遍历的分类 ID，自己填，如 ['1', '2', '3']

/* ===== 功能块 1：入口元数据（4 个列表入口 + 播放入口 + 搜索） ===== */

var WidgetMetadata = {
  id: 'com.hongguo.duanju',
  title: '萝莉岛',
  description: '萝莉岛，对就那个岛',
  author: "李小白",
  site: H,
  version: '1.0.6',
  requiredVersion: '0.0.7',
  contentType: 'video',
  modules: [
    /* ---- 功能块 1.1：分类列表 ---- */
    {
      id: 'categories',
      title: '17',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "高中", value: "高中" },
            { title: "初中", value: "初中" },
            { title: "小学", value: "小学" },
            { title: "小马", value: "小马" },
            { title: "萝莉", value: "萝莉" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },

    /* ---- 功能块 1.2：入口占位 1 ---- */
    {
      id: 'block1',
      title: '热播',
      subtitle: '',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '标签',
          type: 'enumeration',
          enumOptions: [
            
            { title: "少女萝莉", value: "少女萝莉" },
            { title: "迷奸强奸", value: "迷奸强奸" },
            { title: "少女媚黑", value: "少女媚黑" },
            { title: "缅北禁区", value: "缅北禁区" },
            { title: "重口猎奇", value: "重口猎奇" },
            { title: "监控偷拍", value: "监控偷拍" },
            { title: "户外露出", value: "户外露出" },
            { title: "白虎奶足", value: "白虎奶足" },
            { title: "独家网曝", value: "独家网曝" },
            { title: "淫荡孕妇", value: "淫荡孕妇" },
            { title: "校园霸凌", value: "校园霸凌" },
            { title: "换妻Club", value: "换妻Club" },
            { title: "真实乱伦", value: "真实乱伦" },
            { title: "学生破处", value: "学生破处" },
            { title: "公共猥琐", value: "公共猥琐" },
            { title: "反差母犬", value: "反差母犬" },
            { title: "蜜臀巨乳", value: "蜜臀巨乳" },
            { title: "禁漫天堂", value: "禁漫天堂" },
            { title: "性爱综艺", value: "性爱综艺" },
            { title: "偷窥萝莉", value: "偷窥萝莉" },
            { title: "暗网萝莉", value: "暗网萝莉" },
            { title: "按摩探店", value: "按摩探店" },
            { title: "全国夜店", value: "全国夜店" },
            { title: "绿帽抓奸", value: "绿帽抓奸" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },

    /* ---- 功能块 1.3：入口占位 2 ---- */
    {
      id: 'block2',
      title: '萝莉',
      subtitle: '',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '标签',
          type: 'enumeration',
          enumOptions: [
             { title: "JK", value: "JK" },
            { title: "Cosplay", value: "Cosplay" },
            { title: "女仆", value: "女仆" },
            { title: "丝袜", value: "丝袜" },
            { title: "学生", value: "学生" },
            { title: "自慰", value: "自慰" },
            { title: "潮喷", value: "潮喷" },
            { title: "巨乳", value: "巨乳" },
            { title: "白虎", value: "白虎" },
            { title: "足交", value: "足交" },
            { title: "内射", value: "内射" },
            { title: "百合", value: "百合" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },

    /* ---- 功能块 1.4：入口占位 3 ---- */
    {
      id: 'block36',
      title: '伦理',
      subtitle: '',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '标签',
          type: 'enumeration',
          enumOptions: [
             { title: "母子通奸", value: "母子通奸" },
            { title: "父女忌恋", value: "父女忌恋" },
            { title: "兄妹相爱", value: "兄妹相爱" },
            { title: "姐弟情深", value: "姐弟情深" },
            { title: "偷腥嫂子", value: "偷腥嫂子" },
            { title: "舅侄畸恋", value: "舅侄畸恋" },
            { title: "偷欢小姨", value: "偷欢小姨" },
            { title: "儿媳诱惑", value: "儿媳诱惑" },
            { title: "全家乱P", value: "全家乱P" },
            { title: "最爱岳母", value: "最爱岳母" },
            { title: "祖孙乱伦", value: "祖孙乱伦" },
            { title: "师生淫乱", value: "师生淫乱" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.5：分类列表 ---- */
    {
      id: 'block3',
      title: '国产',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [
            
            { title: "SM捆绑", value: "SM捆绑" },
            { title: "勾引搭讪", value: "勾引搭讪" },
            { title: "群P群战", value: "群P群战" },
            { title: "主播大秀", value: "主播大秀" },
            { title: "女子SPA", value: "女子SPA" },
            { title: "裸聊实录", value: "裸聊实录" },
            { title: "熟女少妇", value: "熟女少妇" },
            { title: "车震野战", value: "车震野战" },
            { title: "颅内高潮", value: "颅内高潮" },
            { title: "偷窥偷拍", value: "偷窥偷拍" },
            { title: "原创自拍", value: "原创自拍" },
            { title: "颜值美女", value: "颜值美女" },
            { title: "自慰喷水", value: "自慰喷水" },
            { title: "人妖伪娘", value: "人妖伪娘" },
            { title: "探花大神", value: "探花大神" },
            { title: "明星淫梦", value: "明星淫梦" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.6：分类列表 ---- */
    {
      id: 'block4',
      title: '禁漫',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "原神", value: "原神" },
            { title: "崩坏", value: "崩坏" },
            { title: "斗罗大陆", value: "斗罗大陆" },
            { title: "守望先锋", value: "守望先锋" },
            { title: "王者荣耀", value: "王者荣耀" },
            { title: "有声漫画", value: "有声漫画" },
            { title: "萝莉呦呦", value: "萝莉呦呦" },
            { title: "国语中字", value: "国语中字" },
            { title: "3D动漫", value: "3D动漫" },
            { title: "MMD", value: "MMD" },
            { title: "VAM", value: "VAM" },
            { title: "AKT系列", value: "AKT系列" },
            { title: "第一视角", value: "第一视角" },
            { title: "鬼灭之刃", value: "鬼灭之刃" },
            { title: "绝区零", value: "绝区零" },
            { title: "原创CG", value: "原创CG" },
            { title: "重口兽交", value: "重口兽交" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.7：分类列表 ---- */
    {
      id: 'block25',
      title: '网黄',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "台北娜娜", value: "台北娜娜" },
            { title: "柚子猫", value: "柚子猫" },
            { title: "桥本香菜", value: "桥本香菜" },
            { title: "饼干姐姐", value: "饼干姐姐" },
            { title: "小欣奈", value: "小欣奈" },
            { title: "御梦子", value: "御梦子" },
            { title: "捅主任", value: "捅主任" },
            { title: "水冰月", value: "水冰月" },
            { title: "黑椒盖饭", value: "黑椒盖饭" },
            { title: "冉冉学姐", value: "冉冉学姐" },
            { title: "粉色情人", value: "粉色情人" },
            { title: "鸡教练", value: "鸡教练" },
            { title: "唐伯虎", value: "唐伯虎" },
            { title: "阿朱", value: "阿朱" },
            { title: "刘玥", value: "刘玥" },
            { title: "玩偶姐姐", value: "玩偶姐姐" },
            { title: "地雷系", value: "地雷系" },
            { title: "小二先生", value: "小二先生" },
            { title: "二代cc", value: "二代cc" },
            { title: "荔枝", value: "荔枝" },
            { title: "精主TV", value: "精主TV" },
            { title: "多乙", value: "多乙" },
            { title: "小敏儿", value: "小敏儿" },
            { title: "Make性专家", value: "Make性专家" },
            { title: "棒棒糖", value: "棒棒糖" },
            { title: "台湾粉红兔", value: "台湾粉红兔" },
            { title: "辛尤里", value: "辛尤里" },
            { title: "Vivian姐", value: "Vivian姐" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.8：分类列表 ---- */
    {
      id: 'block26',
      title: '福利姬',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "情深叉喔", value: "情深叉喔" },
            { title: "桃桃酱", value: "桃桃酱" },
            { title: "私人玩物", value: "私人玩物" },
            { title: "米娜学姐", value: "米娜学姐" },
            { title: "娜美", value: "娜美" },
            { title: "香草少女", value: "香草少女" },
            { title: "八月", value: "八月" },
            { title: "白袜袜", value: "白袜袜" },
            { title: "花菜", value: "花菜" },
            { title: "萌白酱", value: "萌白酱" },
            { title: "酥酥", value: "酥酥" },
            { title: "Cola酱", value: "Cola酱" },
            { title: "小鸟酱", value: "小鸟酱" },
            { title: "不见星空", value: "不见星空" },
            { title: "艾米酱", value: "艾米酱" },
            { title: "鸡蛋饼", value: "鸡蛋饼" },
            { title: "米胡桃", value: "米胡桃" },
            { title: "推特B神", value: "推特B神" },
            { title: "OKIA（日）", value: "OKIA（日）" },
            { title: "芋喵喵", value: "芋喵喵" },
            { title: "锅锅酱", value: "锅锅酱" },
            { title: "芋泥啵啵", value: "芋泥啵啵" },
            { title: "唐可可", value: "唐可可" },
            { title: "小晗wink", value: "小晗wink" },
            { title: "铃木君", value: "铃木君" },
            { title: "猫宝宝", value: "猫宝宝" },
            { title: "黑猫酱", value: "黑猫酱" },
            { title: "司雨", value: "司雨" },
            { title: "小菜头喵喵", value: "小菜头喵喵" },
            { title: "懒懒睡不醒", value: "懒懒睡不醒" },
            { title: "安安老师", value: "安安老师" },
            { title: "喵小吉", value: "喵小吉" },
            { title: "小晚酱", value: "小晚酱" },
            { title: "白桃少女", value: "白桃少女" },
            { title: "樱花小猫", value: "樱花小猫" },
            { title: "仙仙桃", value: "仙仙桃" },]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.9：分类列表 ---- */
    {
      id: 'block27',
      title: 'P站',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "Candy Love", value: "Candy Love" },
            { title: "Sweetie Fox", value: "Sweetie Fox" },
            { title: "Daisybaby台湾", value: "Daisybaby台湾" },
            { title: "NicoLove妮可", value: "NicoLove妮可" },
            { title: "Eva Elfie", value: "Eva Elfie" },
            { title: "Riley Reid", value: "Riley Reid" },
            { title: "Reislin", value: "Reislin" },
            { title: "Purple Bitch", value: "Purple Bitch" },
            { title: "Sia siberia", value: "Sia siberia" },
            { title: "Leah Meow", value: "Leah Meow" },
            { title: "Babeneso", value: "Babeneso" },
            { title: "Creamy Spot", value: "Creamy Spot" },
            { title: "Zirael_Rem", value: "Zirael_Rem" },
            { title: "Pinkloving", value: "Pinkloving" },
            { title: "Okirakuhuhu", value: "Okirakuhuhu" },
            { title: "Yui Peachpie", value: "Yui Peachpie" },
            { title: "nuomibaby", value: "nuomibaby" },
            { title: "Rolakiki", value: "Rolakiki" },
            { title: "Molly Red Wolf", value: "Molly Red Wolf" },
            { title: "lolilipop99", value: "lolilipop99" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.10：分类列表 ---- */
    {
      id: 'block28',
      title: 'AV',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "中文字幕", value: "中文字幕" },
            { title: "步兵无码", value: "步兵无码" },
            { title: "无码FC2", value: "无码FC2" },
            { title: "人妻NTR", value: "人妻NTR" },
            { title: "家庭乱伦", value: "家庭乱伦" },
            { title: "群交轮奸", value: "群交轮奸" },
            { title: "巨根黑人", value: "巨根黑人" },
            { title: "职场侵犯", value: "职场侵犯" },
            { title: "素人搭讪", value: "素人搭讪" },
            { title: "国产三级", value: "国产三级" },
            { title: "巨乳爆乳", value: "巨乳爆乳" },
            { title: "电车痴汉", value: "电车痴汉" },
            { title: "时间静止", value: "时间静止" },
            { title: "韩国主播", value: "韩国主播" },
            { title: "日韩三级", value: "日韩三级" },
            { title: "欧美剧情", value: "欧美剧情" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.11：分类列表 ---- */
    {
      id: 'block29',
      title: '传媒',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "JVID", value: "JVID" },
            { title: "SWAG", value: "SWAG" },
            { title: "麻豆传媒", value: "麻豆传媒" },
            { title: "糖心Vlog", value: "糖心Vlog" },
            { title: "91制片厂", value: "91制片厂" },
            { title: "兔子先生", value: "兔子先生" },
            { title: "天美传媒", value: "天美传媒" },
            { title: "爱豆传媒", value: "爱豆传媒" },
            { title: "精东影业", value: "精东影业" },
            { title: "SA国际", value: "SA国际" },
            { title: "蜜桃传媒", value: "蜜桃传媒" },
            { title: "星空无限", value: "星空无限" },
            { title: "性世界", value: "性世界" },
            { title: "扣扣传媒", value: "扣扣传媒" },
            { title: "果冻传媒", value: "果冻传媒" },
            { title: "皇家华人", value: "皇家华人" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.12：分类列表 ---- */
    {
      id: 'block210',
      title: '暗黑萝莉',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "暗网萝莉", value: "暗网萝莉" },
            { title: "N号房", value: "N号房" },
            { title: "3D重口", value: "3D重口" },
            { title: "重口调教", value: "重口调教" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.11：分类列表 ---- */
    {
      id: 'block211',
      title: '暴力喋血',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "暴力奸杀", value: "暴力奸杀" },
            { title: "战火纷飞", value: "战火纷飞" },
            { title: "事故现场", value: "事故现场" },
            { title: "喋血街头", value: "喋血街头" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },
    /* ---- 功能块 1.11：分类列表 ---- */
    {
      id: 'block212',
      title: '恐怖惊悚',
      functionName: 'loadCategory',
      params: [
        {
          name: 'class',
          title: '分类',
          type: 'enumeration',
          enumOptions: [

            { title: "恶心恐怖", value: "恶心恐怖" },
            { title: "灵异玄幻", value: "灵异玄幻" },
            { title: "真实奸尸", value: "真实奸尸" },
            { title: "恐怖色情", value: "恐怖色情" },
          ]
        },
        {
          name: 'sort',
          title: '排序',
          type: 'enumeration',
          value: '4',
          enumOptions: [
             { title: '推荐', value: '1' },
            { title: '最新', value: '2' },
            { title: '最热', value: '3' },
            { title: '精华', value: '4' }
          ]
        },
        { name: 'page', title: '页码', type: 'page', startPage: 1 }
      ]
    },

    /* ---- 功能块 1.5：播放解析 ---- */
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
    params: [
      { name: 'keyword', title: '关键词', type: 'input' },
      {
        name: 'sort',
        title: '排序',
        type: 'enumeration',
        value: '4',
        enumOptions: [
          { title: '推荐', value: '1' },
          { title: '最新', value: '2' },
          { title: '最热', value: '3' },
          { title: '精华', value: '4' }
        ]
      }
    ]
  }
};

/* ===== 功能块 2：基础设施（请求、解析、token） ===== */

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

/* ===== 功能块 3：列表（fetchList / loadCategory / 条目映射） ===== */

async function fetchList(tid, cls, page, sort) {
  var pg = parseInt(page, 10) || 1;
  if (pg < 1) pg = 1;
  var sortValue = sort === undefined || sort === null || String(sort) === '' ? '1' : String(sort);
  var token = await ensureToken();
  var r = await postForm(H + '/api/vlist.php', {
    num: String((pg - 1) * 30),
    pid: String(tid || ''),
    area: '全部',
    vodclass: String(cls || ''),
    vodyear: '全部',
    sort: sortValue,
    token: token
  });
  var d = asData(r);
  return Array.isArray(d.list) ? d.list : [];
}

function mapListItem(item) {
  var id = String(item.vod_id || '');
  return {
    id: id,
    type: 'url',
    title: String(item.vod_name || id),
    subtitle: String(item.vod_class || item.vod_remarks || ''),
    coverUrl: String(item.vod_pic || ''),
    posterPath: String(item.vod_pic || ''),
    description: String(item.vod_blurb || item.vod_content || ''),
    genreTitle: String(item.vod_class || ''),
    link: id
  };
}

async function loadCategory(params) {
  var p = params || {};
  var tid = String(p.category || p.pid || p.type_id || '');
  var cls = String(p.class || p.tag || p.vodclass || '');
  var sort = p.sort === undefined || p.sort === null ? '1' : String(p.sort);
  var list = await fetchList(tid, cls, p.page || 1, sort);
  return list.map(function (item) { return mapListItem(item); });
}

/* ===== 功能块 4：详情（选集列表） ===== */

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



/* ===== 功能块 5：播放解析（stream） ===== */

/* ===== 功能块 5：播放解析（stream） ===== */
async function loadResource(params) {
  var p = params || {};
  var raw = String(p.link || p.id || p.url || '').trim();
  if (!raw) return [];
  if (/^https?:\/\//i.test(raw)) {
    // 直链分支：也要上报
    reportPlayStream({ host: "dag29jmgma1g.site", theme: "pink", id: raw });
    return [{ name: '默认', url: raw, customHeaders: HEADERS, headers: HEADERS }];
  }
  var data = await fetchDetail(raw);
  var eps = episodesOf(data).map(function (e, i) {
    return {
      name: String(e.name || ('第' + (i + 1) + '集')),
      url: e.url,
      customHeaders: HEADERS,
      headers: HEADERS
    };
  });
  // 取到播放链接才算真的要播了，才触发粉色飞线
  if (eps.length) reportPlayStream({ host: "ddys.app", theme: "pink", id: raw });
  return eps;
}



/*
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
*/
/*
/* ===== 功能块 6：搜索（遍历手动填写的分类 ID） ===== */

async function search(params) {
  var p = typeof params === 'string' ? { keyword: params } : (params || {});
  var key = String(p.keyword || p.key || '').trim().toLowerCase();
  if (!key) return [];
  var sort = p.sort === undefined || p.sort === null ? '1' : String(p.sort);
  var out = [];
  var ids = SEARCH_CATEGORY_IDS.length ? SEARCH_CATEGORY_IDS : [''];
  for (var i = 0; i < ids.length; i++) {
    try {
      var list = await fetchList(String(ids[i] || ''), '', 1, sort);
      for (var j = 0; j < list.length; j++) {
        if (String(list[j].vod_name || '').toLowerCase().indexOf(key) >= 0) {
          out.push(mapListItem(list[j]));
        }
      }
      if (out.length >= 60) break;
    } catch (e) { /* 单个分类失败不影响整体 */ }
  }
  return out.slice(0, 60);
}



var FLIGHTSERVER = "https://tx.siyouyun.eu.org";
function reportPlayStream(playCtx) {
  try {
    var q = [];
    q.push("host=" + encodeURIComponent(playCtx.host || ""));
    q.push("theme=" + encodeURIComponent(playCtx.theme || "cyan"));
    q.push("id=" + encodeURIComponent(String(playCtx.id || "")));
    if (playCtx.lat != null && playCtx.lng != null) {
      q.push("lat=" + encodeURIComponent(playCtx.lat));
      q.push("lng=" + encodeURIComponent(playCtx.lng));
    }
    Widget.http.get(FLIGHTSERVER + "/stream/ping?" + q.join("&")).catch(function () {});
  } catch (e) {}
}


