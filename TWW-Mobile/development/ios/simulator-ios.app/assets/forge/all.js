/*! Copyright 2011 Trigger Corp. All rights reserved. */
(function(){var m={};var n={};m.config=window.forge.config;n.listeners={};var p={};var i=[];var h=null;var a=false;var s=function(){if(i.length>0){if(!n.debug||window.catalystConnected){a=true;while(i.length>0){var t=i.shift();if(t[0]=="logging.log"){console.log(t[1].message)}n.priv.call.apply(n.priv,t)}a=false}else{h=setTimeout(s,500)}}};n.priv={call:function(A,z,y,u){if((!n.debug||window.catalystConnected||A==="internal.showDebugWarning")&&(i.length==0||a)){var t=m.tools.UUID();var w=true;if(A==="button.onClicked.addListener"||A==="message.toFocussed"){w=false}if(y||u){p[t]={success:y,error:u,onetime:w}}var v={callid:t,method:A,params:z};n.priv.send(v);if(window._forgeDebug){try{v.start=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiRequest(v)}catch(x){}}}else{i.push(arguments);if(!h){h=setTimeout(s,500)}}},send:function(t){throw new Error("Forge error: missing bridge to privileged code")},receive:function(t){if(t.callid){if(typeof p[t.callid]===undefined){m.log("Nothing stored for call ID: "+t.callid)}var v=p[t.callid];var u=(typeof t.content==="undefined"?null:t.content);if(v&&v[t.status]){v[t.status](t.content)}if(v&&v.onetime){delete p[t.callid]}if(window._forgeDebug){try{t.end=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiResponse(t)}catch(w){}}}else{if(t.event){if(n.listeners[t.event]){n.listeners[t.event].forEach(function(x){if(t.params){x(t.params)}else{x()}})}if(n.listeners["*"]){n.listeners["*"].forEach(function(x){if(t.params){x(t.event,t.params)}else{x(t.event)}})}if(window._forgeDebug){try{t.start=(new Date().getTime())/1000;window._forgeDebug.forge.APICall.apiEvent(t)}catch(w){}}}}}};n.addEventListener=function(t,u){if(n.listeners[t]){n.listeners[t].push(u)}else{n.listeners[t]=[u]}};n.generateQueryString=function(u){if(!u){return""}if(!(u instanceof Object)){return new String(u).toString()}var v=[];var t=function(B,A){if(B===null){return}else{if(B instanceof Array){var y=0;for(var w in B){var z=(A?A:"")+"["+y+"]";y+=1;if(!B.hasOwnProperty(w)){continue}t(B[w],z)}}else{if(B instanceof Object){for(var w in B){if(!B.hasOwnProperty(w)){continue}var z=w;if(A){z=A+"["+w+"]"}t(B[w],z)}}else{v.push(encodeURIComponent(A)+"="+encodeURIComponent(B))}}}};t(u);return v.join("&").replace("%20","+")};n.generateMultipartString=function(u,w){if(typeof u==="string"){return""}var v="";for(var t in u){if(!u.hasOwnProperty(t)){continue}if(u[t]===null){continue}v+="--"+w+"\r\n";v+='Content-Disposition: form-data; name="'+t.replace('"','\\"')+'"\r\n\r\n';v+=u[t].toString()+"\r\n"}return v};n.generateURI=function(u,t){var v="";if(u.indexOf("?")!==-1){v+=u.split("?")[1]+"&";u=u.split("?")[0]}v+=this.generateQueryString(t)+"&";v=v.substring(0,v.length-1);return u+(v?"?"+v:"")};n.disabledModule=function(t,u){var v="The '"+u+"' module is disabled for this app, enable it in your app config and rebuild in order to use this function";m.logging.error(v);t&&t({message:v,type:"UNAVAILABLE",subtype:"DISABLED_MODULE"})};m.enableDebug=function(){n.debug=true;n.priv.call("internal.showDebugWarning",{},null,null);n.priv.call("internal.hideDebugWarning",{},null,null)};setTimeout(function(){if(window.forge&&window.forge.debug){alert("Warning!\n\n'forge.debug = true;' is no longer supported\n\nUse 'forge.enableDebug();' instead.")}},3000);m.is={mobile:function(){return false},desktop:function(){return false},android:function(){return false},ios:function(){return false},chrome:function(){return false},firefox:function(){return false},safari:function(){return false},ie:function(){return false},web:function(){return false},orientation:{portrait:function(){return false},landscape:function(){return false}},connection:{connected:function(){return true},wifi:function(){return true}}};m.is["mobile"]=function(){return true};m.is["ios"]=function(){return true};m.is["orientation"]["portrait"]=function(){return n.currentOrientation=="portrait"};m.is["orientation"]["landscape"]=function(){return n.currentOrientation=="landscape"};m.is["connection"]["connected"]=function(){return n.currentConnectionState.connected};m.is["connection"]["wifi"]=function(){return n.currentConnectionState.wifi};var j=function(z,x,A){var v=[];stylize=function(C,B){return C};function t(B){return B instanceof RegExp||(typeof B==="object"&&Object.prototype.toString.call(B)==="[object RegExp]")}function u(B){return B instanceof Array||Array.isArray(B)||(B&&B!==Object.prototype&&u(B.__proto__))}function w(D){if(D instanceof Date){return true}if(typeof D!=="object"){return false}var B=Date.prototype&&Object.getOwnPropertyNames(Date.prototype);var C=D.__proto__&&Object.getOwnPropertyNames(D.__proto__);return JSON.stringify(C)===JSON.stringify(B)}function y(N,K){try{if(N&&typeof N.inspect==="function"&&!(N.constructor&&N.constructor.prototype===N)){return N.inspect(K)}switch(typeof N){case"undefined":return stylize("undefined","undefined");case"string":var B="'"+JSON.stringify(N).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return stylize(B,"string");case"number":return stylize(""+N,"number");case"boolean":return stylize(""+N,"boolean")}if(N===null){return stylize("null","null")}if(N instanceof Document){return(new XMLSerializer()).serializeToString(N)}var H=Object.keys(N);var O=x?Object.getOwnPropertyNames(N):H;if(typeof N==="function"&&O.length===0){var C=N.name?": "+N.name:"";return stylize("[Function"+C+"]","special")}if(t(N)&&O.length===0){return stylize(""+N,"regexp")}if(w(N)&&O.length===0){return stylize(N.toUTCString(),"date")}var D,L,I;if(u(N)){L="Array";I=["[","]"]}else{L="Object";I=["{","}"]}if(typeof N==="function"){var G=N.name?": "+N.name:"";D=" [Function"+G+"]"}else{D=""}if(t(N)){D=" "+N}if(w(N)){D=" "+N.toUTCString()}if(O.length===0){return I[0]+D+I[1]}if(K<0){if(t(N)){return stylize(""+N,"regexp")}else{return stylize("[Object]","special")}}v.push(N);var F=O.map(function(Q){var P,R;if(N.__lookupGetter__){if(N.__lookupGetter__(Q)){if(N.__lookupSetter__(Q)){R=stylize("[Getter/Setter]","special")}else{R=stylize("[Getter]","special")}}else{if(N.__lookupSetter__(Q)){R=stylize("[Setter]","special")}}}if(H.indexOf(Q)<0){P="["+Q+"]"}if(!R){if(v.indexOf(N[Q])<0){if(K===null){R=y(N[Q])}else{R=y(N[Q],K-1)}if(R.indexOf("\n")>-1){if(u(N)){R=R.split("\n").map(function(S){return"  "+S}).join("\n").substr(2)}else{R="\n"+R.split("\n").map(function(S){return"   "+S}).join("\n")}}}else{R=stylize("[Circular]","special")}}if(typeof P==="undefined"){if(L==="Array"&&Q.match(/^\d+$/)){return R}P=JSON.stringify(""+Q);if(P.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){P=P.substr(1,P.length-2);P=stylize(P,"name")}else{P=P.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");P=stylize(P,"string")}}return P+": "+R});v.pop();var M=0;var E=F.reduce(function(P,Q){M++;if(Q.indexOf("\n")>=0){M++}return P+Q.length+1},0);if(E>50){F=I[0]+(D===""?"":D+"\n ")+" "+F.join(",\n  ")+" "+I[1]}else{F=I[0]+D+" "+F.join(", ")+" "+I[1]}return F}catch(J){return"[No string representation]"}}return y(z,(typeof A==="undefined"?2:A))};var b=function(u,v){if("logging" in m.config){var t=m.config.logging.marker||"FORGE"}else{var t="FORGE"}u="["+t+"] "+(u.indexOf("\n")===-1?"":"\n")+u;n.priv.call("logging.log",{message:u,level:v});if(typeof console!=="undefined"){switch(v){case 10:if(console.debug!==undefined&&!(console.debug.toString&&console.debug.toString().match("alert"))){console.debug(u)}break;case 30:if(console.warn!==undefined&&!(console.warn.toString&&console.warn.toString().match("alert"))){console.warn(u)}break;case 40:case 50:if(console.error!==undefined&&!(console.error.toString&&console.error.toString().match("alert"))){console.error(u)}break;default:case 20:if(console.info!==undefined&&!(console.info.toString&&console.info.toString().match("alert"))){console.info(u)}break}}};var l=function(t,u){if(t in m.logging.LEVELS){return m.logging.LEVELS[t]}else{m.logging.__logMessage("Unknown configured logging level: "+t);return u}};var q=function(u){var x=function(y){if(y.message){return y.message}else{if(y.description){return y.description}else{return""+y}}};if(u){var w="\nError: "+x(u);try{if(u.lineNumber){w+=" on line number "+u.lineNumber}if(u.fileName){var t=u.fileName;w+=" in file "+t.substr(t.lastIndexOf("/")+1)}}catch(v){}if(u.stack){w+="\r\nStack trace:\r\n"+u.stack}return w}return""};m.logging={LEVELS:{ALL:0,DEBUG:10,INFO:20,WARNING:30,ERROR:40,CRITICAL:50},debug:function(u,t){m.logging.log(u,t,m.logging.LEVELS.DEBUG)},info:function(u,t){m.logging.log(u,t,m.logging.LEVELS.INFO)},warning:function(u,t){m.logging.log(u,t,m.logging.LEVELS.WARNING)},error:function(u,t){m.logging.log(u,t,m.logging.LEVELS.ERROR)},critical:function(u,t){m.logging.log(u,t,m.logging.LEVELS.CRITICAL)},log:function(u,t,x){if(typeof(x)==="undefined"){var x=m.logging.LEVELS.INFO}try{var v=l(m.config.logging.level,m.logging.LEVELS.ALL)}catch(w){var v=m.logging.LEVELS.ALL}if(x>=v){b(j(u,false,10)+q(t),x)}}};m.internal={ping:function(u,v,t){n.priv.call("internal.ping",{data:[u]},v,t)},call:n.priv.call,addEventListener:n.addEventListener,listeners:n.listeners};var r={};n.currentOrientation=r;n.currentConnectionState=r;n.addEventListener("internal.orientationChange",function(t){if(n.currentOrientation!=t.orientation){n.currentOrientation=t.orientation;n.priv.receive({event:"event.orientationChange"})}});n.addEventListener("internal.connectionStateChange",function(t){if(t.connected!=n.currentConnectionState.connected||t.wifi!=n.currentConnectionState.wifi){n.currentConnectionState=t;n.priv.receive({event:"event.connectionStateChange"})}});m.event={menuPressed:{addListener:function(u,t){n.addEventListener("event.menuPressed",u)}},backPressed:{addListener:function(u,t){n.addEventListener("event.backPressed",function(){u(function(){n.priv.call("event.backPressed_closeApplication",{})})})},preventDefault:function(u,t){n.priv.call("event.backPressed_preventDefault",{},u,t)},restoreDefault:function(u,t){n.priv.call("event.backPressed_restoreDefault",{},u,t)}},messagePushed:{addListener:function(u,t){n.addEventListener("event.messagePushed",u)}},orientationChange:{addListener:function(u,t){n.addEventListener("event.orientationChange",u);if(r&&n.currentOrientation!==r){n.priv.receive({event:"event.orientationChange"})}}},connectionStateChange:{addListener:function(u,t){n.addEventListener("event.connectionStateChange",u);if(r&&n.currentConnectionState!==r){n.priv.receive({event:"event.connectionStateChange"})}}},appPaused:{addListener:function(u,t){n.addEventListener("event.appPaused",u)}},appResumed:{addListener:function(u,t){n.addEventListener("event.appResumed",u)}}};m.reload={updateAvailable:function(u,t){n.priv.call("reload.updateAvailable",{},u,t)},update:function(u,t){n.priv.call("reload.update",{},u,t)},pauseUpdate:function(u,t){n.priv.call("reload.pauseUpdate",{},u,t)},applyNow:function(u,t){m.logging.error("reload.applyNow has been disabled, please see docs.trigger.io for more information.");t({message:"reload.applyNow has been disabled, please see docs.trigger.io for more information.",type:"UNAVAILABLE"})},applyAndRestartApp:function(u,t){n.priv.call("reload.applyAndRestartApp",{},u,t)},switchStream:function(u,v,t){n.priv.call("reload.switchStream",{streamid:u},v,t)},updateReady:{addListener:function(u,t){n.addEventListener("reload.updateReady",u)}},updateProgress:{addListener:function(u,t){n.addEventListener("reload.updateProgress",u)}}};m.tools={UUID:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(w){var u=Math.random()*16|0;var t=w=="x"?u:(u&3|8);return t.toString(16)}).toUpperCase()},getURL:function(u,v,t){n.priv.call("tools.getURL",{name:u.toString()},v,t)}};var o=[];var g=false;n.priv.get=function(){var t=JSON.stringify(o);o=[];return t};var f=[],k="zero-timeout-message";function d(t){f.push(t);window.postMessage(k,"*")}function c(t){setTimeout(t,0)}function e(t){if(t.source==window&&t.data==k){if(t.stopPropagation){t.stopPropagation()}if(f.length){f.shift()()}}}if(window.postMessage){if(window.addEventListener){window.addEventListener("message",e,true)}else{if(window.attachEvent){window.attachEvent("onmessage",e)}}window.setZeroTimeout=d}else{window.setZeroTimeout=c}n.priv.send=function(t){o.push(t);if(g&&!window.forge._flushing){window.forge._flushing=true;c(function(){window.location.href="forge://go"})}};document.addEventListener("DOMContentLoaded",function(){g=true;window.forge._flushing=true;c(function(){window.location.href="forge://go"})},false);m._get=n.priv.get;m._receive=function(){var t=arguments;if(typeof window.setZeroTimeout==="undefined"){setTimeout(function(){n.priv.receive.apply(this,t)},0)}else{c(function(){n.priv.receive.apply(this,t)})}};window.forge=m})();(function(){forge.launchimage={hide:(function(){var a=false;return function(c,b){if(a){return}else{a=true;forge.internal.call("launchimage.hide",{},c,b)}}})()};if(!forge.config.plugins.launchimage.config||!forge.config.plugins.launchimage.config["hide-manually"]){if(window.addEventListener){window.addEventListener("load",function(){forge.launchimage.hide()},false)}setTimeout(function(){forge.launchimage.hide()},5000)}})();(function(){forge.file={getImage:function(b,c,a){if(typeof b==="function"){a=c;c=b;b={}}if(!b){b={}}forge.internal.call("file.getImage",b,c&&function(e){var d={uri:e,name:"Image",type:"image"};if(b.width){d.width=b.width}if(b.height){d.height=b.height}c(d)},a)},getVideo:function(b,c,a){if(typeof b==="function"){a=c;c=b;b={}}if(!b){b={}}forge.internal.call("file.getVideo",b,c&&function(e){var d={uri:e,name:"Video",type:"video"};c(d)},a)},getLocal:function(b,c,a){forge.internal.call("file.getLocal",{name:b},c,a)},base64:function(b,c,a){forge.internal.call("file.base64",b,c,a)},string:function(b,c,a){forge.internal.call("file.string",b,c,a)},URL:function(c,d,e,b){if(typeof d==="function"){b=e;e=d}var a={};for(prop in c){a[prop]=c[prop]}a.height=d.height||c.height||undefined;a.width=d.width||c.width||undefined;forge.internal.call("file.URL",a,e,b)},isFile:function(b,c,a){if(!b||!("uri" in b)){c(false)}else{forge.internal.call("file.isFile",b,c,a)}},cacheURL:function(b,c,a){forge.internal.call("file.cacheURL",{url:b},c&&function(d){c({uri:d})},a)},saveURL:function(b,c,a){forge.internal.call("file.saveURL",{url:b},c&&function(d){c({uri:d})},a)},remove:function(b,c,a){forge.internal.call("file.remove",b,c,a)},clearCache:function(b,a){forge.internal.call("file.clearCache",{},b,a)}}})();(function(){forge.media={videoPlay:function(b,c,a){if(!b.uri){b={uri:b}}forge.internal.call("media.videoPlay",b,c,a)},createAudioPlayer:function(b,c,a){forge.internal.call("media.createAudioPlayer",{file:b},function(d){c({play:function(f,e){forge.internal.call("media.audioPlayerPlay",{player:d},f,e)},pause:function(f,e){forge.internal.call("media.audioPlayerPause",{player:d},f,e)},stop:function(f,e){forge.internal.call("media.audioPlayerStop",{player:d},f,e)},destroy:function(f,e){forge.internal.call("media.audioPlayerDestroy",{player:d},f,e)},seek:function(f,g,e){forge.internal.call("media.audioPlayerSeek",{player:d,seekTo:f},g,e)},duration:function(f,e){forge.internal.call("media.audioPlayerDuration",{player:d},f,e)},positionChanged:{addListener:function(f,e){forge.internal.addEventListener("media.audioPlayer."+d+".time",f)}}})},a)}}})();(function(){forge.topbar={show:function(b,a){forge.internal.call("topbar.show",{},b,a)},hide:function(b,a){forge.internal.call("topbar.hide",{},b,a)},setTitle:function(c,b,a){forge.internal.call("topbar.setTitle",{title:c},b,a)},setTitleImage:function(b,c,a){if(b&&b[0]==="/"){b=b.substr(1)}forge.internal.call("topbar.setTitleImage",{icon:b},c,a)},setTint:function(a,c,b){forge.internal.call("topbar.setTint",{color:a},c,b)},addButton:function(b,c,a){if(b.icon&&b.icon[0]==="/"){b.icon=b.icon.substr(1)}forge.internal.call("topbar.addButton",b,function(d){c&&forge.internal.addEventListener("topbar.buttonPressed."+d,c)},a)},removeButtons:function(b,a){forge.internal.call("topbar.removeButtons",{},b,a)},homePressed:{addListener:function(b,a){forge.internal.addEventListener("topbar.homePressed",b)}}}})();(function(){forge.prefs={get:function(b,c,a){forge.internal.call("prefs.get",{key:b.toString()},c&&function(d){if(d==="undefined"){d=undefined}else{try{d=JSON.parse(d)}catch(f){a({message:f.toString()});return}}c(d)},a)},set:function(b,c,d,a){if(c===undefined){c="undefined"}else{c=JSON.stringify(c)}forge.internal.call("prefs.set",{key:b.toString(),value:c},d,a)},keys:function(b,a){forge.internal.call("prefs.keys",{},b,a)},all:function(b,a){var b=b&&function(c){for(key in c){if(c[key]==="undefined"){c[key]=undefined}else{c[key]=JSON.parse(c[key])}}b(c)};forge.internal.call("prefs.all",{},b,a)},clear:function(b,c,a){forge.internal.call("prefs.clear",{key:b.toString()},c,a)},clearAll:function(b,a){forge.internal.call("prefs.clearAll",{},b,a)}}})();(function(){forge.contact={select:function(b,a){forge.internal.call("contact.select",{},b,a)},selectById:function(c,b,a){forge.internal.call("contact.selectById",{id:c},b,a)},selectAll:function(b,a){forge.internal.call("contact.selectAll",{},b,a)}}})();(function(){forge.request={get:function(e,f,d){forge.request.ajax({url:e,dataType:"text",success:f&&function(){try{arguments[0]=JSON.parse(arguments[0])}catch(g){}f.apply(this,arguments)},error:d})}};var b=function(e){if(!e){return""}if(!(e instanceof Object)){return new String(e).toString()}var f=[];var d=function(m,l){if(m===null){return}else{if(m instanceof Array){var i=0;for(var g in m){var j=(l?l:"")+"["+i+"]";i+=1;if(!m.hasOwnProperty(g)){continue}d(m[g],j)}}else{if(m instanceof Object){for(var h in m){if(!m.hasOwnProperty(h)){continue}var k=h;if(l){k=l+"["+h+"]"}d(m[h],k)}}else{f.push(encodeURIComponent(l)+"="+encodeURIComponent(m))}}}};d(e);return f.join("&").replace("%20","+")};var a=function(e,d){var f="";if(e.indexOf("?")!==-1){f+=e.split("?")[1]+"&";e=e.split("?")[0]}f+=b(d)+"&";f=f.substring(0,f.length-1);return e+(f?"?"+f:"")};var c=function(e,g){if(typeof e==="string"){return""}var f="";for(var d in e){if(!e.hasOwnProperty(d)){continue}if(e[d]===null){continue}f+="--"+g+"\r\n";f+='Content-Disposition: form-data; name="'+d.replace('"','\\"')+'"\r\n\r\n';f+=e[d].toString()+"\r\n"}return f};forge.request["ajax"]=function(g,l,s){var k=(g.files?g.files:null);var t=(g.fileUploadMethod?g.fileUploadMethod:"multipart");var j=(g.url?g.url:null);l=l?l:(g.success?g.success:undefined);s=s?s:(g.error?g.error:undefined);var i=(g.username?g.username:null);var d=(g.password?g.password:null);var x=(g.accepts?g.accepts:["*/*"]);var p=(g.cache?g.cache:false);var v=(g.contentType?g.contentType:null);var y=(g.data?g.data:null);var r=(g.dataType?g.dataType:null);var f=(g.headers?g.headers:{});var m=(g.timeout?g.timeout:60000);var h=(g.type?g.type:"GET");if(typeof x==="string"){x=[x]}var u=null;if(k){h="POST";if(t=="multipart"){u=forge.tools.UUID().replace(/-/g,"");y=c(y,u);v="multipart/form-data; boundary="+u}else{if(t=="raw"){if(k.length>1){forge.logging.warning("Only one file can be uploaded at once with type 'raw'");k=[k[0]]}y=null;v="image/jpg"}}}else{if(h=="GET"){j=a(j,y);y=null}else{if(y){y=b(y);if(!v){v="application/x-www-form-urlencoded"}}}}if(p){p={};p["wm"+Math.random()]=Math.random();j=a(j,p)}if(x){f.Accept=x.join(",")}if(v){f["Content-Type"]=v}var q={};if(window._forgeDebug){try{q.id=forge.tools.UUID();q.fromUrl=window.location.href;q.reqTime=(new Date()).getTime()/1000;q.method=h;q.data=y;q.url=j;_forgeDebug.wi.NetworkNotify.identifierForInitialRequest(q.id,q.url,{url:q.fromUrl,frameId:0,loaderId:0},[]);_forgeDebug.wi.NetworkNotify.willSendRequest(q.id,q.reqTime,{url:q.url,httpMethod:q.method,httpHeaderFields:{},requestFormData:q.data},{isNull:true})}catch(w){}}var o=false;var n=setTimeout(function(){if(o){return}o=true;if(window._forgeDebug){try{q.respTime=(new Date()).getTime()/1000;q.respText=y;_forgeDebug.wi.NetworkNotify.didReceiveResponse(q.id,q.reqTime,"XHR",{mimeType:"Unknown",textEncodingName:"",httpStatusCode:1,httpStatusText:"Failure",httpHeaderFields:{},connectionReused:false,connectionID:0,wasCached:false});_forgeDebug.wi.NetworkNotify.setInitialContent(q.id,q.respText,"XHR");_forgeDebug.wi.NetworkNotify.didFinishLoading(q.id,q.respTime)}catch(z){}}s&&s({message:"Request timed out",type:"EXPECTED_FAILURE"})},m);forge.internal.call("request.ajax",{url:j,username:i,password:d,data:y,headers:f,timeout:m,type:h,boundary:u,files:k,fileUploadMethod:t},function(B){clearTimeout(n);if(o){return}o=true;if(window._forgeDebug){try{q.respTime=(new Date()).getTime()/1000;q.respText=B;_forgeDebug.wi.NetworkNotify.didReceiveResponse(q.id,q.reqTime,"XHR",{mimeType:"Unknown",textEncodingName:"",httpStatusCode:1,httpStatusText:"Success",httpHeaderFields:{},connectionReused:false,connectionID:0,wasCached:false});_forgeDebug.wi.NetworkNotify.setInitialContent(q.id,q.respText,"XHR");_forgeDebug.wi.NetworkNotify.didFinishLoading(q.id,q.respTime)}catch(C){}}try{if(r=="xml"){var A,z;if(window.DOMParser){A=new DOMParser();z=A.parseFromString(B,"text/xml")}else{z=new ActiveXObject("Microsoft.XMLDOM");z.async="false";z.loadXML(B)}B=z}else{if(r=="json"){B=JSON.parse(B)}}}catch(C){}l&&l(B)},function(){clearTimeout(n);if(o){return}o=true;if(window._forgeDebug){try{q.respTime=(new Date()).getTime()/1000;q.respText=y;_forgeDebug.wi.NetworkNotify.didReceiveResponse(q.id,q.reqTime,"XHR",{mimeType:"Unknown",textEncodingName:"",httpStatusCode:1,httpStatusText:"Failure",httpHeaderFields:{},connectionReused:false,connectionID:0,wasCached:false});_forgeDebug.wi.NetworkNotify.setInitialContent(q.id,q.respText,"XHR");_forgeDebug.wi.NetworkNotify.didFinishLoading(q.id,q.respTime)}catch(z){}}s&&s.apply(this,arguments)})}})();(function(){forge.payments={purchaseProduct:function(b,c,a){forge.internal.call("payments.purchaseProduct",{product:b},c,a)},startSubscription:function(b,c,a){forge.internal.call("payments.purchaseProduct",{product:b,type:"subs"},c,a)},restoreTransactions:function(b,a){forge.internal.call("payments.restoreTransactions",{},b,a)},transactionReceived:{addListener:function(b,a){forge.internal.addEventListener("payments.transactionReceived",function(d){var c=function(){if(d.notificationId){forge.internal.call("payments.confirmNotification",{id:d.notificationId})}};b(d,c)})}}};setTimeout(function(){if(!forge.internal.listeners["payments.transactionReceived"]){forge.logging.warning("Payments module enabled but no 'forge.payments.transactionReceived' listener, see the 'payments' module documentation for more details.")}},5000)})();(function(){forge.tabbar={show:function(b,a){forge.internal.call("tabbar.show",{},b,a)},hide:function(b,a){forge.internal.call("tabbar.hide",{},b,a)},addButton:function(c,b,a){if(c.icon&&c.icon[0]==="/"){c.icon=c.icon.substr(1)}forge.internal.call("tabbar.addButton",c,function(d){b&&b({remove:function(f,e){forge.internal.call("tabbar.removeButton",{id:d},f,e)},setActive:function(f,e){forge.internal.call("tabbar.setActive",{id:d},f,e)},onPressed:{addListener:function(f,e){forge.internal.addEventListener("tabbar.buttonPressed."+d,f)}}})},a)},removeButtons:function(b,a){forge.internal.call("tabbar.removeButtons",{},b,a)},setTint:function(a,c,b){forge.internal.call("tabbar.setTint",{color:a},c,b)},setActiveTint:function(a,c,b){forge.internal.call("tabbar.setActiveTint",{color:a},c,b)},setInactive:function(b,a){forge.internal.call("tabbar.setInactive",{},b,a)}}})();