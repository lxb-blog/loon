// ===== Rex 模块：糖心 Vlog（txxkl7s60j.com）=====
var WidgetMetadata = {
  id: "com.rex.txxkl7s60j",
  title: "糖心Vlog",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  description: "糖心Vlog 首页精选、分区频道、标签筛选、搜索、详情、Worker 完整播放线路与弹幕",
  author: "Rex Module",
  site: "https://txxkl7s60j.com",
  contentType: "video",
  globalParams: [
    { name: "token", title: "站点 Token（可选，留空自动游客登录）", type: "input" }
  ],
  modules: [
    { id: "home", title: "首页精选", functionName: "loadHome",
      params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "block", title: "分区频道", functionName: "loadBlocks",
      params: [
        { name: "id", title: "分区", type: "enumeration", enumOptions: [
          { title: "糖心Vlog", value: "1" },
          { title: "新人驾到", value: "3" },
          { title: "糖心次元", value: "5" },
          { title: "糖心福利姬", value: "8" },
          { title: "糖心Vloger", value: "244" },
          { title: "糖心乱伦", value: "238" }
        ] },
        { name: "order", title: "排序", type: "enumeration", enumOptions: [
          { title: "最新", value: "new" },
          { title: "热度最高", value: "hot" },
          { title: "最多观看", value: "click" },
          { title: "最多收藏", value: "favorite" }
        ] },
        { name: "page", title: "页码", type: "page" }
      ] },
    { id: "tag", title: "标签筛选", functionName: "loadTag",
      params: [
        { name: "tag", title: "标签名或 ID", type: "input" },
        { name: "page", title: "页码", type: "page" }
      ] },
    { id: "loadResource", title: "播放线路", functionName: "loadResource", type: "stream", params: [] },
    { id: "loadSubtitle", title: "字幕", functionName: "loadSubtitle", type: "subtitle", params: [] },
    { id: "searchDanmu", title: "弹幕搜索", functionName: "searchDanmu", type: "danmu", params: [] },
    { id: "getDetail", title: "弹幕分集", functionName: "getDetail", type: "danmu", params: [] },
    { id: "getComments", title: "弹幕列表", functionName: "getComments", type: "danmu", params: [] }
  ],
  search: { id: "search", title: "搜索", functionName: "search",
    params: [{ name: "page", title: "页码", type: "page" }] }
};

// 纯 JS 加密/压缩工具，供 Rex 模块内嵌使用（无 require、无 WebCrypto）
const SBOX=[
  99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,
  202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,
  183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,
  4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,
  9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,
  83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,
  208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,
  81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,
  205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,
  96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,
  224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,
  231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,
  186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,
  112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,
  225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,
  140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22
];
const INVBOX=[
  82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,251,
  124,227,57,130,155,47,255,135,52,142,67,68,196,222,233,203,
  84,123,148,50,166,194,35,61,238,76,149,11,66,250,195,78,
  8,46,161,102,40,217,36,178,118,91,162,73,109,139,209,37,
  114,248,246,100,134,104,152,22,212,164,92,204,93,101,182,146,
  108,112,72,80,253,237,185,218,94,21,70,87,167,141,157,132,
  144,216,171,0,140,188,211,10,247,228,88,5,184,179,69,6,
  208,44,30,143,202,63,15,2,193,175,189,3,1,19,138,107,
  58,145,17,65,79,103,220,234,151,242,207,206,240,180,230,115,
  150,172,116,34,231,173,53,133,226,249,55,232,28,117,223,110,
  71,241,26,113,29,41,197,137,111,183,98,14,170,24,190,27,
  252,86,62,75,198,210,121,32,154,219,192,254,120,205,90,244,
  31,221,168,51,136,7,199,49,177,18,16,89,39,128,236,95,
  96,81,127,169,25,181,74,13,45,229,122,159,147,201,156,239,
  160,224,59,77,174,42,245,176,200,235,187,60,131,83,153,97,
  23,43,4,126,186,119,214,38,225,105,20,99,85,33,12,125
];
function utf8(str){
  const out=[];
  for(let i=0;i<str.length;i++){
    const c=str.charCodeAt(i);
    if(c<0x80)out.push(c);
    else if(c<0x800){out.push(0xc0|(c>>6),0x80|(c&63));}
    else if(c>=0xd800&&c<=0xdbff&&i+1<str.length){
      const c2=str.charCodeAt(++i);
      const cp=0x10000+((c-0xd800)<<10)+(c2-0xdc00);
      out.push(0xf0|(cp>>18),0x80|((cp>>12)&63),0x80|((cp>>6)&63),0x80|(cp&63));
    }else out.push(0xe0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));
  }
  return new Uint8Array(out);
}
function fromUTF8(bytes){
  let s='';
  for(let i=0;i<bytes.length;){
    const b=bytes[i++];
    if(b<0x80){s+=String.fromCharCode(b);}
    else if(b<0xe0){s+=String.fromCharCode(((b&31)<<6)|(bytes[i++]&63));}
    else if(b<0xf0){s+=String.fromCharCode(((b&15)<<12)|((bytes[i++]&63)<<6)|(bytes[i++]&63));}
    else{const cp=((b&7)<<18)|((bytes[i++]&63)<<12)|((bytes[i++]&63)<<6)|(bytes[i++]&63);const v=cp-0x10000;s+=String.fromCharCode(0xd800|(v>>10),0xdc00|(v&1023));}
  }
  return s;
}
function b64encode(bytes){
  const T='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';let s='';
  for(let i=0;i<bytes.length;i+=3){
    const a=bytes[i],b=i+1<bytes.length?bytes[i+1]:0,c=i+2<bytes.length?bytes[i+2]:0,n=(a<<16)|(b<<8)|c;
    s+=T[(n>>18)&63]+T[(n>>12)&63]+(i+1<bytes.length?T[(n>>6)&63]:'=')+(i+2<bytes.length?T[n&63]:'=');
  }
  return s;
}
function b64decode(str){
  const T='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';const out=[];
  for(let i=0;i<str.length;i+=4){
    let n=0;
    for(let j=0;j<4;j++){const ch=str[i+j];n=(n<<6)|(ch&&ch!=='='?T.indexOf(ch):0);}
    out.push((n>>16)&255);if(str[i+2]!=='=')out.push((n>>8)&255);if(str[i+3]!=='=')out.push(n&255);
  }
  return new Uint8Array(out);
}
// ---------- MD5 ----------
function md5(bytes){
  const S=[7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
    5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
    4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
    6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const K=[];for(let i=0;i<64;i++)K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296);
  const len=bytes.length,bitLen=len*8;
  const msg=new Uint8Array((((len+8)>>6)+1)*64);msg.set(bytes);msg[len]=0x80;
  const dv=new DataView(msg.buffer);
  dv.setUint32(msg.length-8,bitLen>>>0,true);dv.setUint32(msg.length-4,Math.floor(bitLen/4294967296),true);
  let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;
  for(let off=0;off<msg.length;off+=64){
    const M=new Uint32Array(16);for(let i=0;i<16;i++)M[i]=dv.getUint32(off+i*4,true);
    let A=a0,B=b0,C=c0,D=d0;
    for(let i=0;i<64;i++){
      let F,g;
      if(i<16){F=(B&C)|(~B&D);g=i;}
      else if(i<32){F=(D&B)|(~D&C);g=(5*i+1)%16;}
      else if(i<48){F=B^C^D;g=(3*i+5)%16;}
      else{F=C^(B|~D);g=(7*i)%16;}
      const t=(A+F+K[i]+M[g])>>>0;
      A=D;D=C;C=B;B=(B+(((t<<S[i])|(t>>>(32-S[i])))>>>0))>>>0;
    }
    a0=(a0+A)>>>0;b0=(b0+B)>>>0;c0=(c0+C)>>>0;d0=(d0+D)>>>0;
  }
  const out=new Uint8Array(16),o=new DataView(out.buffer);
  o.setUint32(0,a0,true);o.setUint32(4,b0,true);o.setUint32(8,c0,true);o.setUint32(12,d0,true);
  return out;
}
function hex(bytes){let s='';for(let i=0;i<bytes.length;i++)s+=('0'+bytes[i].toString(16)).slice(-2);return s;}
// ---------- SHA-256 / HMAC ----------
const SHAK=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const rotr=(x,n)=>((x>>>n)|(x<<(32-n)))>>>0;
function sha256(bytes){
  const bitLen=bytes.length*8;
  const msg=new Uint8Array((((bytes.length+8)>>6)+1)*64);msg.set(bytes);msg[bytes.length]=0x80;
  const dv=new DataView(msg.buffer);
  dv.setUint32(msg.length-8,Math.floor(bitLen/4294967296),false);dv.setUint32(msg.length-4,bitLen>>>0,false);
  let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const w=new Uint32Array(64);
  for(let off=0;off<msg.length;off+=64){
    for(let i=0;i<16;i++)w[i]=dv.getUint32(off+i*4,false);
    for(let i=16;i<64;i++){
      const s0=rotr(w[i-15],7)^rotr(w[i-15],18)^(w[i-15]>>>3);
      const s1=rotr(w[i-2],17)^rotr(w[i-2],19)^(w[i-2]>>>10);
      w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;
    }
    let [a,b,c,d,e,f,g,h]=H;
    for(let i=0;i<64;i++){
      const S1=rotr(e,6)^rotr(e,11)^rotr(e,25);
      const ch=(e&f)^(~e&g);
      const t1=(h+S1+ch+SHAK[i]+w[i])>>>0;
      const S0=rotr(a,2)^rotr(a,13)^rotr(a,22);
      const maj=(a&b)^(a&c)^(b&c);
      const t2=(S0+maj)>>>0;
      h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
    }
    H=[(H[0]+a)>>>0,(H[1]+b)>>>0,(H[2]+c)>>>0,(H[3]+d)>>>0,(H[4]+e)>>>0,(H[5]+f)>>>0,(H[6]+g)>>>0,(H[7]+h)>>>0];
  }
  const out=new Uint8Array(32),o=new DataView(out.buffer);
  for(let i=0;i<8;i++)o.setUint32(i*4,H[i],false);
  return out;
}
function hmacSha256(key,msg){
  let k=new Uint8Array(64);
  if(key.length>64)key=sha256(key);
  k.set(key);
  const ipad=new Uint8Array(64),opad=new Uint8Array(64);
  for(let i=0;i<64;i++){ipad[i]=k[i]^0x36;opad[i]=k[i]^0x5c;}
  const inner=new Uint8Array(64+msg.length);inner.set(ipad);inner.set(msg,64);
  const ih=sha256(inner);
  const outer=new Uint8Array(96);outer.set(opad);outer.set(ih,64);
  return sha256(outer);
}
// ---------- AES-256-CBC ----------
function gmul(a,b){let p=0;for(let i=0;i<8;i++){if(b&1)p^=a;const hi=a&0x80;a=(a<<1)&255;if(hi)a^=0x1b;b>>=1;}return p;}
function expandKey(key){
  const Nk=key.length/4,Nr=Nk+6,W=new Uint32Array(4*(Nr+1)),dv=new DataView(key.buffer,key.byteOffset,key.length);
  for(let i=0;i<Nk;i++)W[i]=dv.getUint32(i*4,false);
  let rcon=1;
  for(let i=Nk;i<4*(Nr+1);i++){
    let t=W[i-1];
    if(i%Nk===0){
      t=((t<<8)|(t>>>24))>>>0;
      const b=[(t>>>24)&255,(t>>>16)&255,(t>>>8)&255,t&255];
      t=((SBOX[b[0]]<<24)|(SBOX[b[1]]<<16)|(SBOX[b[2]]<<8)|SBOX[b[3]])>>>0;
      t^=(rcon<<24)>>>0;rcon=gmul(rcon,2);
    }else if(Nk>6&&i%Nk===4){
      const b=[(t>>>24)&255,(t>>>16)&255,(t>>>8)&255,t&255];
      t=((SBOX[b[0]]<<24)|(SBOX[b[1]]<<16)|(SBOX[b[2]]<<8)|SBOX[b[3]])>>>0;
    }
    W[i]=(W[i-Nk]^t)>>>0;
  }
  return {W,Nr};
}
function roundKey(W,r){return [W[4*r],W[4*r+1],W[4*r+2],W[4*r+3]];}
function addRoundKey(s,rk){for(let c=0;c<4;c++){s[4*c]^=(rk[c]>>>24)&255;s[4*c+1]^=(rk[c]>>>16)&255;s[4*c+2]^=(rk[c]>>>8)&255;s[4*c+3]^=rk[c]&255;}}
function mixColumns(s){
  for(let c=0;c<4;c++){
    const i=4*c,a=s[i],b=s[i+1],d=s[i+2],e=s[i+3];
    s[i]=gmul(a,2)^gmul(b,3)^d^e;s[i+1]=a^gmul(b,2)^gmul(d,3)^e;
    s[i+2]=a^b^gmul(d,2)^gmul(e,3);s[i+3]=gmul(a,3)^b^d^gmul(e,2);
  }
}
function invMixColumns(s){
  for(let c=0;c<4;c++){
    const i=4*c,a=s[i],b=s[i+1],d=s[i+2],e=s[i+3];
    s[i]=gmul(a,14)^gmul(b,11)^gmul(d,13)^gmul(e,9);
    s[i+1]=gmul(a,9)^gmul(b,14)^gmul(d,11)^gmul(e,13);
    s[i+2]=gmul(a,13)^gmul(b,9)^gmul(d,14)^gmul(e,11);
    s[i+3]=gmul(a,11)^gmul(b,13)^gmul(d,9)^gmul(e,14);
  }
}
function encryptBlock(block,ctx){
  const s=new Uint8Array(block);
  addRoundKey(s,roundKey(ctx.W,0));
  for(let r=1;r<ctx.Nr;r++){
    for(let i=0;i<16;i++)s[i]=SBOX[s[i]];
    for(let row=1;row<4;row++){
      const t=[s[row],s[4+row],s[8+row],s[12+row]];
      for(let c=0;c<4;c++)s[4*c+row]=t[(c+row)%4];
    }
    mixColumns(s);addRoundKey(s,roundKey(ctx.W,r));
  }
  for(let row=1;row<4;row++){
    const t=[s[row],s[4+row],s[8+row],s[12+row]];
    for(let c=0;c<4;c++)s[4*c+row]=t[(c+row)%4];
  }
  for(let i=0;i<16;i++)s[i]=SBOX[s[i]];
  addRoundKey(s,roundKey(ctx.W,ctx.Nr));
  return s;
}
function decryptBlock(block,ctx){
  const s=new Uint8Array(block);
  addRoundKey(s,roundKey(ctx.W,ctx.Nr));
  for(let r=ctx.Nr-1;r>=1;r--){
    for(let row=1;row<4;row++){
      const t=[s[row],s[4+row],s[8+row],s[12+row]];
      for(let c=0;c<4;c++)s[4*((c+row)%4)+row]=t[c];
    }
    for(let i=0;i<16;i++)s[i]=INVBOX[s[i]];
    addRoundKey(s,roundKey(ctx.W,r));invMixColumns(s);
  }
  for(let row=1;row<4;row++){
    const t=[s[row],s[4+row],s[8+row],s[12+row]];
    for(let c=0;c<4;c++)s[4*((c+row)%4)+row]=t[c];
  }
  for(let i=0;i<16;i++)s[i]=INVBOX[s[i]];
  addRoundKey(s,roundKey(ctx.W,0));
  return s;
}
function aesEncrypt(key,iv,data){
  const ctx=expandKey(key),pad=16-(data.length%16);
  const input=new Uint8Array(data.length+pad);input.set(data);for(let i=data.length;i<input.length;i++)input[i]=pad;
  const out=new Uint8Array(input.length),blk=new Uint8Array(16);
  for(let off=0;off<input.length;off+=16){
    for(let i=0;i<16;i++)blk[i]=input[off+i]^iv[i];
    const e=encryptBlock(blk,ctx);out.set(e,off);iv=e.slice();
  }
  return out;
}
function aesDecrypt(key,iv,data){
  const ctx=expandKey(key),out=new Uint8Array(data.length);
  for(let off=0;off<data.length;off+=16){
    const c=new Uint8Array(16);for(let i=0;i<16;i++)c[i]=data[off+i];
    const p=decryptBlock(c,ctx);
    for(let i=0;i<16;i++)out[off+i]=p[i]^iv[i];
    iv=c;
  }
  const pad=out[out.length-1];return out.subarray(0,out.length-(pad>0&&pad<=16?pad:0));
}
// ---------- gzip（存储块，无压缩）/ gunzip ----------
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++)c=CRC[(c^bytes[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function gzipStore(bytes){
  const out=[0x1f,0x8b,0x08,0x00,0,0,0,0,0,0xff];
  for(let off=0;off<bytes.length;off+=65535){
    const end=Math.min(off+65535,bytes.length),n=end-off,last=end===bytes.length?1:0;
    out.push(last,n&255,(n>>8)&255,(~n)&255,((~n)>>8)&255);
    for(let i=off;i<end;i++)out.push(bytes[i]);
  }
  if(!bytes.length)out.push(1,0,0,255,255);
  const c=crc32(bytes);
  out.push(c&255,(c>>8)&255,(c>>16)&255,(c>>>24)&255,bytes.length&255,(bytes.length>>8)&255,(bytes.length>>16)&255,(bytes.length>>>24)&255);
  return new Uint8Array(out);
}
const LBASE=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
const LEXT=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DBASE=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
const DEXT=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
function buildHuff(lens){
  const max=Math.max.apply(null,lens),count=new Array(max+1).fill(0);
  for(const l of lens)if(l>0)count[l]++;
  count[0]=0;
  const next=new Array(max+1).fill(0);let code=0;
  for(let l=1;l<=max;l++){code=(code+count[l-1])<<1;next[l]=code;}
  const syms=[];for(let l=0;l<=max;l++)syms[l]=new Array(count[l]);
  const off=next.slice();
  for(let s=0;s<lens.length;s++){const l=lens[s];if(l>0)syms[l][off[l]++]=s;}
  return {max,count,next,syms};
}
function inflateRaw(src,start){
  let pos=start*8;
  function bits(n){let v=0;for(let i=0;i<n;i++){v|=((src[pos>>3]>>(pos&7))&1)<<i;pos++;}return v;}
  function align(){pos=(pos+7)&~7;}
  function decode(h){
    let code=0;
    for(let l=1;l<=h.max;l++){
      code=(code<<1)|bits(1);
      const k=code-h.next[l];
      if(k>=0&&k<h.count[l])return h.syms[l][code];
    }
    throw new Error('invalid huffman');
  }
  const out=[];
  while(true){
    const final=bits(1),type=bits(2);
    if(type===0){
      align();const n=bits(16),nn=bits(16);if((n^0xffff)!==nn)throw new Error('bad stored');
      const p=pos>>3;for(let i=0;i<n;i++)out.push(src[p+i]);pos=(p+n)*8;
    }else if(type===1||type===2){
      let lit,dist;
      if(type===1){
        const ll=new Array(288).fill(0),dd=new Array(30).fill(0);
        for(let i=0;i<144;i++)ll[i]=8;for(let i=144;i<256;i++)ll[i]=9;
        for(let i=256;i<280;i++)ll[i]=7;for(let i=280;i<288;i++)ll[i]=8;
        for(let i=0;i<30;i++)dd[i]=5;
        lit=buildHuff(ll);dist=buildHuff(dd);
      }else{
        const hlit=bits(5)+257,hdist=bits(5)+1,hclen=bits(4)+4;
        const order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
        const cl=new Array(19).fill(0);
        for(let i=0;i<hclen;i++)cl[order[i]]=bits(3);
        const ch=buildHuff(cl),lens=[];
        while(lens.length<hlit+hdist){
          const s=decode(ch);
          if(s<16)lens.push(s);
          else if(s===16){const v=lens[lens.length-1],n=3+bits(2);for(let i=0;i<n;i++)lens.push(v);}
          else if(s===17){const n=3+bits(3);for(let i=0;i<n;i++)lens.push(0);}
          else{const n=11+bits(7);for(let i=0;i<n;i++)lens.push(0);}
        }
        lit=buildHuff(lens.slice(0,hlit));dist=buildHuff(lens.slice(hlit,hlit+hdist));
      }
      while(true){
        const s=decode(lit);
        if(s===256)break;
        if(s<256){out.push(s);continue;}
        const li=s-257;
        if(li<0||li>=LBASE.length)throw new Error('bad length');
        const len=LBASE[li]+bits(LEXT[li]);
        const ds=decode(dist);
        if(ds>=DBASE.length)throw new Error('bad distance');
        const d=DBASE[ds]+bits(DEXT[ds]);
        if(d>out.length)throw new Error('distance too far');
        for(let i=0;i<len;i++)out.push(out[out.length-d]);
      }
    }else throw new Error('bad block type');
    if(final)break;
  }
  return new Uint8Array(out);
}
function gunzip(src){
  if(src[0]!==0x1f||src[1]!==0x8b)throw new Error('not gzip');
  const flg=src[3];let i=10;
  if(flg&4){const n=src[i]|(src[i+1]<<8);i+=2+n;}
  if(flg&8){while(src[i])i++;i++;}
  if(flg&16){while(src[i])i++;i++;}
  if(flg&2)i+=2;
  return inflateRaw(src,i);
}
var TX_BASE = "https://txxkl7s60j.com";
var TX_UPSTREAM_HOST = "txxkl7s60j.com";
var TX_WORKER_BASE = "https://txscript.pages.dev/tx";
var TX_RELAY_BASE = "https://tx-relay.648226460.workers.dev";
var TX_APPKEY = "e0202eee7ef7807f";
var TX_SECRET = "2DCiXDoNmuQrJjxktdLPy5cXcVhoC5pw|";
var TX_STORE = "tx_vlog_session_v1";

function txUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.floor(Math.random() * 16);
    return (c === "x" ? r : (r & 3) | 8).toString(16);
  });
}
function txHexBytes(s) {
  var a = [];
  for (var i = 0; i + 1 < s.length; i += 2) a.push(parseInt(s.substr(i, 2), 16));
  return new Uint8Array(a);
}
function txKey(reqId) {
  return hmacSha256(utf8(TX_APPKEY), txHexBytes(reqId.replace(/-/g, "").toLowerCase()));
}
function txIV() {
  var a = new Uint8Array(16);
  for (var i = 0; i < 16; i++) a[i] = Math.floor(Math.random() * 256);
  return a;
}
function txState() {
  try { return JSON.parse(Widget.storage.get(TX_STORE) || "{}"); } catch (e) { return {}; }
}
function txSave(s) {
  try { Widget.storage.set(TX_STORE, JSON.stringify(s)); } catch (e) { console.log("保存会话失败", e); }
}
function txAbs(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return TX_BASE + (url.charAt(0) === "/" ? url : "/" + url);
}
function txDuration(str) {
  if (!str) return undefined;
  var p = String(str).split(":").map(Number);
  if (p.some(isNaN)) return undefined;
  var n = 0;
  for (var i = 0; i < p.length; i++) n = n * 60 + p[i];
  return n;
}
async function txRaw(path, data, token, st, viaWorker, bodyMode) {
  var reqId = txUUID();
  var time = String(Math.floor(Date.now() / 1000));
  var upstreamPath = "/txapi" + path;
  // 签名和 origin 始终按上游域名生成；Worker 只是原样转发，不能按 Worker URL 签名。
  var hostPath = TX_UPSTREAM_HOST + upstreamPath;
  var sign = hex(md5(utf8(TX_SECRET + st.sessionId + "|" + reqId + "|" + time + "|" + hostPath))) + "-" + time;
  var plain = JSON.stringify({ token: token || "", deviceId: st.deviceId, data: data || {} });
  var gz = gzipStore(utf8(plain));
  var iv = txIV();
  var ct = aesEncrypt(txKey(reqId), iv, gz);
  var wire = new Uint8Array(iv.length + ct.length);
  wire.set(iv, 0); wire.set(ct, iv.length);
  var url = viaWorker && TX_WORKER_BASE
    ? TX_WORKER_BASE + "/" + TX_UPSTREAM_HOST + upstreamPath
    : TX_BASE + upstreamPath;
  var headers = {
    "accept": "*/*",
    "origin": "https://" + TX_UPSTREAM_HOST,
    "version": "4.80.1", "deviceType": "web", "time": time, "sign": sign,
    "requestId": reqId, "sessionId": st.sessionId,
    "deviceBrand": "", "deviceModel": "", "systemName": "", "systemVersion": "",
    "deviceFingerprint": st.fingerprint || "", "fpVersion": "3.0.0", "sdkVersion": "1.4.8",
    "Content-Type": "application/octet-stream"
  };
  var enc;
  if (TX_RELAY_BASE) {
    // Rex 的 HTTP 桥接层发不了原始二进制；把加密后的字节转 base64，
    // 交给 Cloudflare Worker 还原为 raw body 后转发，再把响应 base64 返回。
    var r = await Widget.http.request({
      url: TX_RELAY_BASE,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { url: url, headers: headers, bodyBase64: b64encode(wire) },
      decodable: true,
      timeout: 20
    });
    var reply = r && r.data ? r.data : null;
    if (!reply || reply.ok !== true) throw new Error("中转代理失败：" + (reply && reply.error ? reply.error : "无响应"));
    enc = b64decode(String(reply.data || ""));
  } else {
    var r = await Widget.http.request({
      url: url,
      method: "POST",
      headers: headers,
      // 部分 Rex 宿主不会原样发送 Uint8Array，会把它序列化成普通对象，
      // 此时上游会返回「安全性错误D」。bodyMode=1 改用 base64 字符串请求体。
      data: bodyMode === 1 ? b64encode(wire) : wire,
      base64Data: true,
      decodable: false,
      timeout: 20
    });
    enc = b64decode(String(r.data || ""));
  }
  if (enc.length < 32) throw new Error("糖心接口返回数据过短");
  var dec = aesDecrypt(txKey(reqId), enc.subarray(0, 16), enc.subarray(16));
  return JSON.parse(fromUTF8(gunzip(dec)));
}
async function txRawWithBodyFallback(path, data, token, st, viaWorker) {
  var last = null;
  for (var mode = 0; mode < 2; mode++) {
    try {
      var r = await txRaw(path, data, token, st, viaWorker, mode);
      // 宿主若把 Uint8Array 序列化成对象，上游会回「安全性错误D」，
      // 这种响应视为请求体编码失败，继续用 base64 字符串重试。
      if (mode === 0 && r && r.status !== "y" && String(r.error || "").indexOf("安全性错误") >= 0) {
        last = new Error("糖心接口：" + r.error);
        console.log("宿主未按二进制发送请求体，改用 base64 请求体重试");
        continue;
      }
      return r;
    } catch (e) {
      last = e;
      if (mode === 0) console.log("二进制请求体发送失败，改用 base64 请求体重试", e && e.message ? e.message : String(e));
    }
  }
  throw last || new Error("糖心请求失败");
}
function txTokenWithUser(token, userId) {
  token = String(token || "");
  userId = String(userId || "");
  return token && userId ? token + "_" + userId : token;
}
async function txApi(path, data, params, playback) {
  var st = txState();
  if (!st.sessionId) st.sessionId = txUUID().replace(/-/g, "");
  if (!st.deviceId) st.deviceId = txUUID();
  if (!st.fingerprint) st.fingerprint = txUUID().replace(/-/g, "") + txUUID().replace(/-/g, "").slice(0, 32);
  txSave(st);
  var fixed = params && params.token ? String(params.token) : "";
  var token = fixed || st.token || "";
  // 播放解析优先 Worker（海外出口可拿到完整片源），失败再回退直连。
  // 其它接口仍走直连，避免分类/列表/详情元数据受中转通道影响。
  var plans = (playback && TX_WORKER_BASE) ? [true, false] : [false];
  var lastError = null;
  for (var attempt = 0; attempt < 2; attempt++) {
    var needLogin = false;
    for (var pi = 0; pi < plans.length; pi++) {
      var r = null;
      try { r = await txRawWithBodyFallback(path, data, token, st, plans[pi]); }
      catch (e) {
        lastError = new Error("糖心请求失败：" + (e && e.message ? e.message : String(e)));
        console.log((plans[pi] ? "Worker" : "直连") + "请求失败，继续尝试其它通路", lastError.message);
        continue;
      }
      if (r && r.status === "y") return r.data;
      lastError = new Error((r && r.error) ? ("糖心接口：" + r.error) : "糖心接口返回异常");
      if (!fixed && r && (r.errorCode === 2001 || r.errorCode === 2002)) {
        needLogin = true;
        break;
      }
    }
    if (attempt === 0 && needLogin && !fixed) {
      var loginData = {
        line_code: "", channel_code: "", share_code: "", clipboard_text: "",
        device_info: { browserName: "Rex", language: "zh-CN", userAgent: "Rex", platform: "web" }
      };
      var lr = null;
      try { lr = await txRawWithBodyFallback("/login/device", loginData, "", st, false); }
      catch (e) { throw new Error("游客登录失败：" + (e && e.message ? e.message : String(e))); }
      if (lr && lr.status === "y" && lr.data && lr.data.token) {
        st.token = txTokenWithUser(lr.data.token, lr.data.user_id);
        txSave(st);
        token = st.token;
        continue;
      }
    }
    break;
  }
  throw lastError || new Error("糖心接口返回异常");
}
function txItem(m, sectionName) {
  var id = String(m.id || "");
  var people = [];
  var users = m.user_id || m.actors || [];
  for (var i = 0; i < users.length; i++) {
    people.push({ id: String(users[i].id || ""), title: users[i].nickname || users[i].username || "",
      avatar: txAbs(users[i].headico || ""), role: "演员" });
  }
  var genres = [];
  var tags = m.tags || [];
  for (var j = 0; j < tags.length; j++) genres.push({ id: String(tags[j].id || ""), title: tags[j].name || "" });
  var item = {
    id: id, type: "url", link: "tx:" + id,
    title: m.name || "",
    subtitle: sectionName || m.cat_name || (m.user_id && m.user_id[0] ? m.user_id[0].nickname : "") || "",
    coverUrl: txAbs(m.img || ""),
    description: m.description || "",
    rating: m.score || m.rating || "",
    duration: txDuration(m.duration),
    genreTitle: tags.length ? tags.map(function (t) { return t.name; }).join(" / ") : "",
    genreItems: genres,
    peoples: people,
    releaseDate: m.show_at || "",
    customHeaders: {}
  };
  return item;
}
function txUnique(items) {
  var seen = {}, out = [];
  for (var i = 0; i < items.length; i++) {
    if (!seen[items[i].id]) { seen[items[i].id] = 1; out.push(items[i]); }
  }
  return out;
}

async function loadHome(params) {
  params = params || {};
  var page = Number(params.page) || 1;
  var d = await txApi("/movie/navBlock", { id: "1", page: String(page) }, params);
  var sections = d || [], out = [];
  for (var i = 0; i < sections.length; i++) {
    var s = sections[i];
    if (String(s.id) === "-1" || String(s.id) === "-3") continue;
    var items = s.items || [];
    for (var j = 0; j < items.length; j++) out.push(txItem(items[j], s.name));
  }
  return txUnique(out);
}

async function loadBlocks(params) {
  params = params || {};
  var id = params.id || "1";
  var order = params.order || "new";
  var page = Number(params.page) || 1;
  var filter = {};
  try {
    var detail = await txApi("/movie/blockDetail", { id: String(id) }, params);
    var filters = (detail && detail.filters) || [];
    for (var i = 0; i < filters.length; i++) {
      if (filters[i].filter && filters[i].filter.order === order) { filter = filters[i].filter; break; }
    }
    if (!filter.order && filters.length && filters[0].filter) filter = filters[0].filter;
  } catch (e) { console.log("分区筛选读取失败", e); }
  var data = { id: String(id), page: String(page) };
  for (var k in filter) if (Object.prototype.hasOwnProperty.call(filter, k)) data[k] = filter[k];
  data.page = String(page);
  var sections = [];
  try { sections = await txApi("/movie/navBlock", data, params) || []; }
  catch (e) { console.log("分区直取失败，改从首页分区中筛选", e && e.message ? e.message : String(e)); }
  var findSection = function (rows) {
    for (var a = 0; a < rows.length; a++) if (String(rows[a].id) === String(id)) return rows[a];
    return null;
  };
  var chosen = findSection(sections);
  if (!chosen) {
    // 部分分区不能用自身 id 直接请求 navBlock，只能从首页分区里挑同名板块。
    try {
      var homeSections = await txApi("/movie/navBlock", { id: "1", page: String(page) }, params) || [];
      chosen = findSection(homeSections);
      sections = chosen ? [chosen] : homeSections;
    } catch (e) { console.log("首页分区回退失败", e && e.message ? e.message : String(e)); }
  }
  var out = [];
  var list = chosen ? [chosen] : sections;
  for (var b = 0; b < list.length; b++) {
    if (String(list[b].id) === "-1" || String(list[b].id) === "-3") continue;
    for (var c = 0; c < (list[b].items || []).length; c++) out.push(txItem(list[b].items[c], list[b].name));
  }
  return txUnique(out);
}

async function loadTag(params) {
  params = params || {};
  var kw = String(params.tag || "").trim().toLowerCase();
  if (!kw) return [];
  var page = Number(params.page) || 1;
  var sections = await txApi("/movie/navBlock", { id: "1", page: String(page) }, params) || [];
  var out = [];
  for (var i = 0; i < sections.length; i++) {
    var s = sections[i];
    if (String(s.id) === "-1" || String(s.id) === "-3") continue;
    for (var j = 0; j < (s.items || []).length; j++) {
      var m = s.items[j];
      var tags = (m.tags || []).map(function (t) { return String(t.id) + " " + String(t.name || "").toLowerCase(); }).join(" ");
      if (String(m.name || "").toLowerCase().indexOf(kw) >= 0 || tags.indexOf(kw) >= 0) out.push(txItem(m, s.name));
    }
  }
  return txUnique(out);
}

async function search(params) {
  params = params || {};
  var kw = String(params.keyword || "").trim();
  if (!kw) return [];
  var page = Number(params.page) || 1;
  if (params.token) {
    try {
      var d = await txApi("/search/movie", { keyword: kw, page: String(page), page_size: "20", position: "search" }, params);
      var rows = Array.isArray(d) ? d : ((d && d.data) || []);
      if (rows.length) return txUnique(rows.map(function (m) { return txItem(m, "搜索"); }));
    } catch (e) { console.log("在线搜索不可用，改用本地筛选", e); }
  }
  var out = [];
  for (var p = 1; p <= 2; p++) {
    var sections = await txApi("/movie/navBlock", { id: "1", page: String(p) }, params) || [];
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      if (String(s.id) === "-1" || String(s.id) === "-3") continue;
      for (var j = 0; j < (s.items || []).length; j++) {
        var m = s.items[j];
        if (String(m.name || "").toLowerCase().indexOf(kw.toLowerCase()) >= 0) out.push(txItem(m, s.name));
      }
    }
  }
  return txUnique(out);
}

async function loadDetail(link) {
  var id = String(link || "").replace(/^tx:/, "");
  // 详情元数据直连；播放线路单独经 Worker 再取一次，避免境内直连只返回试看片。
  var m = await txApi("/movie/detail", { id: id, lid: "", referer: "" }, {}, false);
  var playData = null;
  try { playData = await txApi("/movie/detail", { id: id }, {}, true); }
  catch (e) { console.log("Worker 播放链接解析失败，回退详情接口线路", e); }
  var people = [], actors = m.actors || m.user_id || [];
  for (var i = 0; i < actors.length; i++) {
    people.push({ id: String(actors[i].id || ""), title: actors[i].nickname || actors[i].username || "",
      avatar: txAbs(actors[i].headico || ""), role: "演员" });
  }
  var genres = [], tags = m.tags || [];
  for (var j = 0; j < tags.length; j++) genres.push({ id: String(tags[j].id || ""), title: tags[j].name || "" });
  var workerLinks = (playData && playData.play_links) || [];
  var links = workerLinks.length ? workerLinks : (m.play_links || []);
  var item = {
    id: String(m.id || id), type: "url", link: link,
    title: m.name || "", description: m.description || "",
    coverUrl: txAbs(m.img || ""), backdropPaths: [],
    rating: m.score || "", duration: txDuration(m.duration),
    releaseDate: m.show_at || "",
    genreItems: genres, peoples: people,
    subtitle: m.cat_name || "",
    customHeaders: {}
  };
  if (links.length > 1) {
    item.episodeItems = links.map(function (l, idx) {
      return { id: String(l.id || id), type: "url", title: l.name || ("线路 " + (idx + 1)),
        episode: idx + 1, videoUrl: txAbs(l.m3u8_url || "") };
    });
  } else if (links.length === 1) item.videoUrl = txAbs(links[0].m3u8_url || "");
  return item;
}

async function loadResource(ctx) {
  ctx = ctx || {};
  var id = String(ctx.id || ctx.link || "").replace(/^tx:/, "");
  // 用户要求播放链接走新 Worker：同一加密请求体发往 Worker，签名仍按上游域名生成。
  var m = await txApi("/movie/detail", { id: id }, {}, true);
  return (m.play_links || []).map(function (l, idx) {
    return { name: l.name || l.code || ("线路 " + (idx + 1)),
      url: txAbs(l.m3u8_url || ""), description: l.code || "",
      playerType: "", customHeaders: {} };
  }).filter(function (r) { return !!r.url; });
}
function loadSubtitle() { return []; }

async function searchDanmu(ctx) {
  ctx = ctx || {};
  var id = String(ctx.id || "").replace(/^tx:/, "");
  return { animes: [{ animeId: id, animeTitle: ctx.title || ctx.seriesName || "" }] };
}
async function getDetail(ctx) {
  ctx = ctx || {};
  var id = String(ctx.animeId || ctx.id || "").replace(/^tx:/, "");
  return [{ episodeId: id, episodeTitle: "正片", episodeNumber: "1" }];
}
async function getComments(ctx) {
  ctx = ctx || {};
  var id = String(ctx.commentId || ctx.animeId || ctx.id || "").replace(/^tx:/, "");
  var d = await txApi("/danmaku/list", {
    object_id: id, sub_id: "", object_type: "movie", start_pos: "0", end_pos: "3600"
  }, {});
  var rows = d || [];
  return { comments: rows.map(function (c) {
    return { p: (c.pos || "0") + ",1," + (c.size || "16") + "," + (c.color || "16777215"), m: c.content || "" };
  }) };
}
